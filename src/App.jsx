import { Tabs } from "antd"
import BookManager from "./component/BookManager"
import CategoryManager from "./component/CategoryManager"

export default function App() {
  const items = [
    {
      label: "Quản Lý Danh Mục",
      key: "1",
      children: <CategoryManager />,
    },
    {
      label: "Quản Lý Sách",
      key: "2",
      children: <BookManager />,
    },
  ];
  return (
    <>
    <h1 class="text-4xl font-bold text-center py-6">Quản Lý Thư Viện</h1>
      <Tabs defaultActiveKey="1" items={items} style={{ padding: "20px" }} />
    </>
  )
}

