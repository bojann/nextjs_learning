import { create } from 'zustand';

export type State = {
  status: 'SUBSCRIBED' | 'FREEMIUM';
};

type Action = {
  setUserStatus: (status: State['status']) => void;
};

export const userStore = create<State & Action>((set) => ({
  status: 'FREEMIUM',
  setUserStatus: (status) => set(() => ({ status: status })),
}));
