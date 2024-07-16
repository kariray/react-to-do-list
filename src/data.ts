import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

// 기본 Todo 아이템 타입
export type TodoItem = {
  id: string;
  todo: string;
};

// 카테고리가 포함된 확장된 Todo 타입
export type Todo = TodoItem & {
  category: string;
};

// 카테고리별로 그룹화된 Todo 타입
export type GroupedTodo = {
  [category: string]: TodoItem[];
};

const { persistAtom } = recoilPersist();

export const todosState = atom<Todo[]>({
  key: "todosState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const toDoSelector = selector({
  key: "toDoSelector",
  get: ({ get }) => {
    const toDos = get(todosState);
    return toDos.reduce((acc, { id, category, todo }) => {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({ id, todo });
      return acc;
    }, {} as GroupedTodo);
  },
});
