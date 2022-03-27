import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  FC,
  ReactElement,
  useEffect,
  useState,
} from 'react';

interface IProps {
  children: ReactElement;
}

export interface ITasksContext {
  tasks: ITask[];
  addTask(task: ITask): void;
}

export interface ITask {
  id: string;
  title: string;
}

const tasksData = '@MyTasks:Tasks';

export const TasksContext = createContext<ITasksContext>({} as ITasksContext);

export const TasksProvider: FC<IProps> = ({children}) => {
  const [data, setData] = useState<ITask[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const taskList = await AsyncStorage.getItem(tasksData);

      if (taskList) {
        setData(JSON.parse(taskList));
      }
    }

    loadTasks();
  }, []);

  const addTask = async (task: ITask) => {
    try {
      const newTaskList = [...data, task];
      setData(newTaskList);
      await AsyncStorage.setItem(tasksData, JSON.stringify(newTaskList));
    } catch (error) {
      throw new Error(error as string);
    }
  };

  return (
    <TasksContext.Provider value={{tasks: data, addTask}}>
      {children}
    </TasksContext.Provider>
  );
};
