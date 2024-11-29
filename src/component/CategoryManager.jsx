import { Button, message, Table, Input } from "antd";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function CategoryManager() {
    const [categories, setCategories] = useState(() => {
        return JSON.parse(localStorage.getItem("categories")) || [];
    });
  const [newCategory, setNewCategory] = useState(""); 

 
  useEffect(() => {
    const storedCategories = JSON.parse(localStorage.getItem("categories")) || [];
    setCategories(storedCategories);
  }, []);

  
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
}, [categories]);

  const addCategory = () => {
    if (!newCategory.trim()) {
      message.error("Tên danh mục không được để trống!");
      return;
    }
    const newCat = { id: uuidv4(), name: newCategory };
    setCategories([...categories, newCat]); 
    setNewCategory(""); 
    message.success("Thêm danh mục thành công!");
  };

 
  const deleteCategory = (id) => {
    const books = JSON.parse(localStorage.getItem("books")) || []; 
    const isUsed = books.some((book) => book.categoryId === id);

    if (isUsed) {
      message.error("Không thể xóa danh mục khi còn sách trong!");
      return;
    }
    setCategories(categories.filter((cat) => cat.id !== id)); 
    message.success("Xóa thành công!");
  };

  
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => deleteCategory(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 class="text-2xl font-bold mb-4">Quản lý danh mục</h2>
      <Input
        placeholder="Tên danh mục"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
      />
      <Button type="primary" onClick={addCategory}>
        Thêm danh mục
      </Button>
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id" 
        style={{ marginTop: "20px" }}
      />
    </div>
  );
}
