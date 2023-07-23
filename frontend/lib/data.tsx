import type { CardProps } from "@components/home/card";
import DragAndDropImage from "@images/drag_and_drop.png";
import DueDateRemindersImage from "@images/due_date_reminders.png";
import PriorityLevelsImage from "@images/priority_levels.png";
import RecurringTasksImage from "@images/recurring_tasks.png";
import SmartRemindersImage from "@images/smart_reminders.png";
import SubtasksImage from "@images/subtasks.png";
import TagsAndLabelsImage from "@images/tags_and_labels.png";
import TaskDependenciesImage from "@images/task_dependencies.png";
import TaskManagementImage from "@images/task_management.png";
import {
  IconClick,
  IconListCheck,
  IconListNumbers,
  IconNotification,
  IconRepeat,
  IconSmartHome,
  IconSubtask,
  IconTags,
  IconUrgent,
} from "@tabler/icons-react";

type Data = {
  id: string;
  title: string;
  summary: string;
  gradient: "yellowToTeal" | "purpleToTeal";
  items: CardProps[];
};

export const HomePageData: Data[] = [
  {
    id: "organize",
    title: "Organize",
    summary:
      "Simplicity meets productivity with our powerful To-do list app. Stay organized, prioritize tasks, and achieve more with ease. It's time to take control of your tasks and streamline your workflow effortlessly.",
    gradient: "yellowToTeal",
    items: [
      {
        title: "Task Management",
        description: "Create, update, and organize tasks efficiently",
        imageSrc: TaskManagementImage,
        icon: <IconListCheck size={24} className="mt-[2px]" />,
      },
      {
        title: "Priority Levels",
        description: "Assign importance to tasks for better focus",
        imageSrc: PriorityLevelsImage,
        icon: <IconUrgent size={24} className="mt-[2px]" />,
      },
      {
        title: "Due Date Reminders",
        description: "Stay on track with timely notifications",
        imageSrc: DueDateRemindersImage,
        icon: <IconNotification size={24} className="mt-[2px]" />,
        wip: true,
      },
      {
        title: "Subtasks",
        description: "Break down tasks into smaller, manageable steps",
        imageSrc: SubtasksImage,
        icon: <IconSubtask size={26} className="mt-[2px]" />,
        wip: true,
      },
      {
        title: "Tags and Labels",
        description: "Categorize tasks for quick reference",
        imageSrc: TagsAndLabelsImage,
        icon: <IconTags size={22} className="mt-[2px]" />,
        wip: true,
      },
      {
        title: "Drag-and-Drop",
        description: "Rearrange tasks effortlessly with intuitive gestures",
        imageSrc: DragAndDropImage,
        icon: <IconClick size={26} className="mt-[2px]" />,
        wip: true,
      },
    ],
  },
  {
    id: "productivity",
    title: "Productivity",
    summary:
      "Boost your productivity and accomplish more than ever before. Our feature-rich To-do list app offers smart functionalities and time-saving tools, empowering you to work smarter, not harder.",
    gradient: "purpleToTeal",
    items: [
      {
        title: "Smart Reminders",
        description: "Receive personalized reminders based on your habits",
        imageSrc: SmartRemindersImage,
        icon: <IconSmartHome size={26} className="mt-[2px]" />,
        wip: true,
      },
      {
        title: "Recurring Tasks",
        description: "Automate repetitive tasks and save time",
        imageSrc: RecurringTasksImage,
        icon: <IconRepeat size={20} className="mt-[2px]" />,
        wip: true,
      },
      {
        title: "Task Dependencies",
        description: "Set task dependencies to manage sequential workflows",
        imageSrc: TaskDependenciesImage,
        icon: <IconListNumbers size={26} className="mt-[2px]" />,
        wip: true,
      },
    ],
  },
];
