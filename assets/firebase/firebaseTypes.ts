import { FieldValue } from 'firebase/firestore';
import { TaskPriority } from '~/assets/ts/types';

interface WithTime {
  createdAt: FieldValue;
  updatedAt: FieldValue;
}

export interface UserModel extends Partial<WithTime> {
  uid: string;
  displayName: string;
  email: string;
  avatar: string | null;
}

export interface WorkspaceSettings {
  joinRequests: {
    pauseRequests: boolean;
  };
}

// for modifying the `workspaces` collection
export interface WorkspacesModel extends WithTime {
  id?: string;
  name: string;
  description: string;
  createdBy: string; // UID of user who creates a workspace
  members: string[]; // array of UIDs of members
  admins: string[]; // array of UIDs of members who're admins
  settings: WorkspaceSettings;
}

// for presenting workspace data for the front-end
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
  TaskStatusChanged = 'TaskStatusChanged',

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
  type: NotificationType;
  createdAt: FieldValue;
  readAt: FieldValue | null;
  payload: any;
}

export interface NotificationSender {
  uid: string;
  name: string;
  avatar: string | null;
}

export interface NotificationTargetWorkspace {
  id: string;
  name: string;
}

// for modifying the `folders` collection
export interface FolderModel extends WithTime {
  id?: string;
  title: string;
  category: string;
  colour: string;
  workspaceID: string;
  createdBy: string;
}

// for presenting workspace data for the front-end
export interface Folder extends FolderModel {
  workspace: {
    id: string;
    name: string;
  };
  tasks: any[];
}

export interface TaskAssignee {
  uid: string;
  name: string;
  avatar: string | null;
}
export interface TaskChecklistItem {
  isDone: boolean;
  description: string;
}
export interface TaskModel extends WithTime {
  id?: string;
  title: string;
  editorjsData: string;
  description: string;
  workspace: {
    id: string;
    name: string;
  };
  folder: {
    id: string;
    title: string;
    colour: string;
  };
  assignees: TaskAssignee[];
  dueDate: string | null;
  createdBy: {
    uid: string;
    name: string;
    avatar: string | null;
  };
  checklist: TaskChecklistItem[];
  priority: TaskPriority | null;
  isCompleted: boolean;
}

export interface InvitationModel extends WithTime {
  id?: string;
  email: string;
  sender: NotificationSender;
  workspace: NotificationTargetWorkspace;
}

export interface InviteNotification extends NotificationsModel {
  type: NotificationType.WorkspaceInviteCreated;
  payload: InvitationModel;
}

export interface InviteAcceptedNotification extends NotificationsModel {
  type: NotificationType.WorkspaceInviteAccepted;
  payload: {
    sender: NotificationSender;
    workspace: NotificationTargetWorkspace;
  };
}

export interface InviteDeclinedNotification extends NotificationsModel {
  type: NotificationType.WorkspaceInviteDeclined;
  payload: {
    sender: NotificationSender;
    workspace: NotificationTargetWorkspace;
  };
}

export interface MemberJoinedNotification extends NotificationsModel {
  type: NotificationType.WorkspaceMemberJoined;
  payload: {
    sender: NotificationSender;
    workspace: NotificationTargetWorkspace;
  };
}

export interface TaskAssignedNotification extends NotificationsModel {
  type: NotificationType.TaskAssigned;
  payload: {
    sender: NotificationSender;
    task: TaskModel;
  };
}

export interface TaskStatusChangedNotification extends NotificationsModel {
  type: NotificationType.TaskStatusChanged;
  payload: {
    sender: NotificationSender;
    task: TaskModel;
  };
}

export interface TaskPriorityChangedNotification extends NotificationsModel {
  type: NotificationType.TaskPriorityChanged;
  payload: {
    sender: NotificationSender;
    task: TaskModel;
  };
}

export type Notification =
  | InviteNotification
  | InviteAcceptedNotification
  | InviteDeclinedNotification
  | TaskAssignedNotification
  | MemberJoinedNotification
  | TaskStatusChangedNotification
  | TaskPriorityChangedNotification;
