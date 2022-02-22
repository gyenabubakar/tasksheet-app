import { Moment } from 'moment';
import { NextPage } from 'next';
import React from 'react';

// 'auth' - for authentication pages (signup, login, verification, reset password).
// 'app' - for the app interface after user is logged in
export type AppLayout = 'auth' | 'app';
export type SecondaryLayout = 'workspace-info';

export type PageWithLayout<T = {}> = NextPage<T> & {
  layout?: AppLayout;
  SecondaryLayout?: React.FC;
};

export interface FolderType {
  id: string;
  name: string;
  colour: string;
  workspaceId?: string;
  category: string;
  tasks?: {
    completed: number;
    total: number;
  };
}

export interface MemberType {
  id: string;
  name: string;
  avatar: string;
  role: string;
  tasks: {
    completed: number;
    total: number;
  };
}

export interface RequestType {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

type TaskPriorityType = 'Low' | 'Normal' | 'High' | 'Urgent';
export enum TaskPriority {
  Low = 'Low',
  Normal = 'Normal',
  High = 'High',
  Urgent = 'Urgent',
}

export interface WorkspaceCardInfo {
  id: string;
  name: string;
  description: string;
  foldersCount: number;
  membersCount: number;
  tasksCount: number;
}

export interface TaskMember {
  id: string;
  name: string;
  avatar: string;
}

export interface TaskChecklist {
  id: string;
  name: string;
  complete: boolean;
}

export interface TaskType {
  id: string;
  name: string;
  description: string;
  dueDate: Moment;
  priority: TaskPriorityType;
  folder: {
    id: string;
    colour: string;
  };
  checkLists: TaskChecklist[];
  members: TaskMember[];
  createdBy: {
    name: string;
    avatar: string;
  };
}

export enum TaskPriorityColour {
  Low = '#14CC8A',
  Normal = '#3b82f6',
  High = '#f97316',
  Urgent = '#e11d48',
}

export interface DropdownItem {
  id: any;
  value: React.ReactNode;
  searchable?: string;
}
