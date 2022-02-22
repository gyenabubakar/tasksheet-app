export interface WorkspaceSettings {
  joinRequests: {
    pauseRequests: boolean;
  };
}

// type for modifying the `workspaces` collection
export interface WorkspaceCollectionModel {
  id?: string;
  name: string;
  description: string;
  createdBy: string; // UID of user who creates a workspace
  members: string[]; // array of UIDs of members
  admins: string[]; // array of UIDs of members who're admins
  settings: WorkspaceSettings;
}

// type for data returned when fetching workspaces from the `workspaces` collection
export interface WorkspaceQueryModel extends WorkspaceCollectionModel {
  // this should be evaluated and added when fetching. Don't store this in the DB
  hasNewJoinRequests: boolean;
}
