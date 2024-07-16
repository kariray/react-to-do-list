import { useForm } from "react-hook-form";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Todo, toDoSelector, todosState } from "../data";

const Container = styled.div`
  margin: 30px 0;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 36px;
  font-weight: 600;
`;

const InputContainer = styled.form`
  margin: 20px 0;
  width: 100%;
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 20px;
  font-size: 18px;
`;

const SubmitButton = styled.button``;

const ListsContainer = styled.div`
  margin-top: 80px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const CategoryContainer = styled.div`
  width: 200px;
  border: 1px solid #000;
  padding: 15px;
`;

const CategoryTitle = styled.h2`
  font-weight: 600;
  font-size: 18px;
  text-align: center;
`;

const ItemContainer = styled.ul`
  margin-top: 10px;
  line-height: 1.8;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
`;

// 폼 입력을 위한 타입 (id 제외)
export type TodoFormData = Omit<Todo, "id">;

function Home() {
  const setTodos = useSetRecoilState(todosState);
  const selectedTodos = useRecoilValue(toDoSelector);
  const { register, handleSubmit, getValues, reset } = useForm<TodoFormData>();

  const setData = () => {
    const data: TodoFormData = getValues();
    const newTodo: Todo = {
      id: `${data.category}_${Date.now()}`,
      category: data.category,
      todo: data.todo,
    };

    setTodos((prevTodos) => {
      // 이미 같은 카테고리와 할 일 내용을 가진 항목이 있는지 확인
      const isDuplicate = prevTodos.some(
        (todo) =>
          todo.category === newTodo.category && todo.todo === newTodo.todo
      );

      // 중복이 아닌 경우에만 새 할 일을 추가
      if (!isDuplicate) {
        return [...prevTodos, newTodo];
      }

      // 중복인 경우 이전 상태를 그대로 반환 (변경 없음)
      return prevTodos;
    });
    reset(); //폼 초기화
  };

  const deleteTodo = (id: string) => {
    setTodos((currentList) => currentList.filter((item) => item.id !== id));
  };

  return (
    <Container>
      <Title>To Do List</Title>
      <InputContainer onSubmit={handleSubmit(setData)}>
        <Input
          type="text"
          id="category"
          {...register("category", { required: true })}
          placeholder="category"
        />
        <Input
          type="text"
          id="todo"
          {...register("todo", { required: true })}
          placeholder="To do"
        />
        <SubmitButton>submit</SubmitButton>
      </InputContainer>
      <ListsContainer>
        {Object.keys(selectedTodos).map((key) => (
          <CategoryContainer key={key}>
            <CategoryTitle>{key}</CategoryTitle>
            <ItemContainer>
              {selectedTodos[key].map((item) => (
                <Item key={item.id}>
                  <span>{item.todo}</span>
                  <span onClick={() => deleteTodo(item.id)}>X</span>
                </Item>
              ))}
            </ItemContainer>
          </CategoryContainer>
        ))}
      </ListsContainer>
    </Container>
  );
}

export default Home;
