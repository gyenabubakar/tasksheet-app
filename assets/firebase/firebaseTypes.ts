import { FieldValue } from 'firebase/firestore';

export interface WorkspaceSettings {
  joinRequests: {
    pauseRequests: boolean;
  };
}

// type for modifying the `workspaces` collection
export interface WorkspacesModel {
  id?: string;
  name: string;
  description: string;
  createdBy: string; // UID of user who creates a workspace
  members: string[]; // array of UIDs of members
  admins: string[]; // array of UIDs of members who're admins
  settings: WorkspaceSettings;
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

// type for data returned when fetching workspaces from the `workspaces` collection
export interface Workspace extends WorkspacesModel {
  // this should be evaluated and added when fetching. Don't store this in the DB
  hasNewJoinRequests: boolean;
  isAdmin: boolean;
  isOwner: boolean;
}

export enum NotificationType {
  // when task is assigned to members. Only assignees get this notification
  TaskAssigned = 'TaskAssigned',

  // when member changes task priority
  TaskPriorityChanged = 'TaskPriorityChanged',

  // when to-do item in task checklist is marked as done
  TaskTodoItemChecked = 'TaskTodoItemChecked',

  // when user accepts workspace invite
  WorkspaceInviteAccepted = 'WorkspaceInviteAccepted',

  // when user declines workspace invite
  WorkspaceInviteDeclined = 'WorkspaceInviteDeclined',

  // when member leaves a workspace
  WorkspaceMemberLeft = 'WorkspaceMemberLeft',

  // after invite or join request accepted. All members get this, except admin who accepted
  WorkspaceMemberJoined = 'WorkspaceMemberJoined',

  // when user initiates a join request
  WorkspaceJoinRequestCreated = 'WorkspaceJoinRequestCreated',

  //= ========================================================================

  /** NOTIFICATIONS BELOW CAN ONLY BE CAUSED BY AN ADMIN */

  // when admin invites users to workspace. Only users gets this notification
  WorkspaceInviteCreated = 'WorkspaceInviteCreated',

  // when admin accepts users join requests. Only users received notification
  WorkspaceJoinRequestAccepted = 'WorkspaceJoinRequestAccepted',

  // when admin removes member. Only member gets this notification
  WorkspaceMemberRemoved = 'WorkspaceMemberRemoved',

  // when admin creates a folder
  FolderAdded = 'FolderAdded',

  //= ========================================================================

  /** NOTIFICATIONS BELOW CAN ONLY BE CAUSED BY A WORKSPACE OWNER */

  // when workspace owner removes member as admin
  WorkspaceAdminRemoved = 'WorkspaceAdminRemoved',

  // when workspace owner makes member admin
  WorkspaceAdminAdded = 'WorkspaceAdminAdded',
}

export interface NotificationsModel {
  id?: string;
  message: string;
  from: string; // UID of user who caused notification to happen
  type: NotificationType;
  meta: any;
}
