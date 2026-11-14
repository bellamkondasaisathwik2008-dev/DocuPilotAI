import { supabase, memoryDb, seedDefaultData } from '../config/supabase.js';

export const documentService = {
  /**
   * Ensure user has at least one workspace and default folder
   */
  async ensureDefaultWorkspace(userId) {
    // Check if user has any workspace
    const { data: existingWorkspaces, error } = await supabase
      .from('workspaces')
      .select('id, name')
      .eq('user_id', userId);

    if (error) {
      console.error('[DocumentService] Error checking workspaces:', error);
      throw error;
    }

    if (!existingWorkspaces || existingWorkspaces.length === 0) {
      // Create General Workspace
      const { data: newWorkspace, error: wsError } = await supabase
        .from('workspaces')
        .insert({
          user_id: userId,
          name: 'General Workspace',
          description: 'Default workspace for incoming notes and documents'
        })
        .select()
        .single();

      if (wsError) throw wsError;

      const wsId = newWorkspace ? newWorkspace.id : (Array.isArray(newWorkspace) ? newWorkspace[0]?.id : null);

      // Create Inbox Folder
      if (wsId) {
        await supabase
          .from('folders')
          .insert({
            user_id: userId,
            workspace_id: wsId,
            name: 'Inbox'
          })
          .select();
      }

      return { createdDefault: true, workspace: newWorkspace };
    }

    return { createdDefault: false, workspaces: existingWorkspaces };
  },

  /**
   * Workspaces API
   */
  async getWorkspaces(userId) {
    await this.ensureDefaultWorkspace(userId);
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createWorkspace(userId, { name, description = '' }) {
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        user_id: userId,
        name: name.trim(),
        description: (description || '').trim()
      })
      .select()
      .single();

    if (error) throw error;

    // Create a default Inbox folder in the new workspace
    const wsId = data ? data.id : null;
    if (wsId) {
      await supabase
        .from('folders')
        .insert({
          user_id: userId,
          workspace_id: wsId,
          name: 'General'
        })
        .select();
    }

    return data;
  },

  async deleteWorkspace(userId, workspaceId) {
    const { data, error } = await supabase
      .from('workspaces')
      .delete()
      .eq('id', workspaceId);

    if (error) throw error;
    return { success: true };
  },

  /**
   * Folders API
   */
  async getFolders(userId, workspaceId = null) {
    let query = supabase
      .from('folders')
      .select('*')
      .eq('user_id', userId);

    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createFolder(userId, { workspaceId, name }) {
    // Verify workspace exists and belongs to user
    const { data: ws, error: wsError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('id', workspaceId)
      .eq('user_id', userId);

    if (wsError || !ws || ws.length === 0) {
      throw new Error('Target workspace not found or unauthorized.');
    }

    const { data, error } = await supabase
      .from('folders')
      .insert({
        user_id: userId,
        workspace_id: workspaceId,
        name: name.trim()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFolder(userId, folderId) {
    const { data, error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);

    if (error) throw error;
    return { success: true };
  },

  /**
   * Documents API
   */
  async getDocuments(userId, { workspaceId, folderId, category, search } = {}) {
    let query = supabase
      .from('documents')
      .select('id, user_id, workspace_id, folder_id, title, category, extraction_depth, output_tone, word_count, created_at, ai_result')
      .eq('user_id', userId);

    if (workspaceId) {
      query = query.eq('workspace_id', workspaceId);
    }
    if (folderId) {
      query = query.eq('folder_id', folderId);
    }
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    let results = data || [];

    // Client-side / In-memory search filtering if keyword provided
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      results = results.filter(doc => 
        doc.title.toLowerCase().includes(term) ||
        (doc.ai_result?.summary || '').toLowerCase().includes(term) ||
        (doc.ai_result?.tldr || '').toLowerCase().includes(term) ||
        doc.category.toLowerCase().includes(term)
      );
    }

    return results;
  },

  async getDocumentById(userId, documentId) {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId);

    if (error) throw error;
    if (!data || data.length === 0) {
      return null;
    }
    return data[0];
  },

  async createDocument(userId, {
    workspace_id,
    folder_id,
    title,
    category,
    extraction_depth,
    output_tone,
    raw_content,
    word_count,
    ai_result
  }) {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        workspace_id,
        folder_id,
        title,
        category,
        extraction_depth,
        output_tone,
        raw_content,
        word_count,
        ai_result
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteDocument(userId, documentId) {
    const { data, error } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);

    if (error) throw error;
    return { success: true };
  },

  /**
   * Analytics API
   */
  async getAnalytics(userId) {
    await this.ensureDefaultWorkspace(userId);

    const [wsRes, docRes] = await Promise.all([
      supabase.from('workspaces').select('id').eq('user_id', userId),
      supabase.from('documents').select('id, category, ai_result, word_count, created_at').eq('user_id', userId)
    ]);

    const workspaces = wsRes.data || [];
    const documents = docRes.data || [];

    let totalActionItems = 0;
    const categoryCounts = {};

    documents.forEach(doc => {
      // Count action items
      if (doc.ai_result?.actionItems && Array.isArray(doc.ai_result.actionItems)) {
        totalActionItems += doc.ai_result.actionItems.length;
      }

      // Count categories
      const cat = doc.category || 'General Document';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    let mostAnalyzedCategory = 'None yet';
    let maxCount = 0;
    for (const [cat, count] of Object.entries(categoryCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostAnalyzedCategory = cat;
      }
    }

    const totalWordsProcessed = documents.reduce((acc, d) => acc + (d.word_count || 0), 0);

    return {
      totalDocuments: documents.length,
      activeWorkspaces: workspaces.length,
      totalActionItems,
      mostAnalyzedCategory,
      totalWordsProcessed,
      categoryBreakdown: categoryCounts,
      recentCount: Math.min(documents.length, 5)
    };
  }
};
