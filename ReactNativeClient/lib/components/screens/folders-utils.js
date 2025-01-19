import { Folder } from '@/lib/models/folder.js';
import { actions } from '@/root.js';

class FoldersScreenUtils {
    static async refreshFolders() {
        let initialFolders = await Folder.all({ includeConflictFolder: true });
        this.dispatch(actions.folders_update_all({ folders: initialFolders }));
    }
}

export { FoldersScreenUtils };
