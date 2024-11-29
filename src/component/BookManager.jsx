import { Button, Input, message, Select, Table, Upload } from 'antd'
import { UploadOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from 'react'

const { Option } = Select;

export default function BookManager() {

    const [isEditing, setIsEditing] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [books, setBooks] = useState(() => {
        return JSON.parse(localStorage.getItem("books")) || [];
    });
    
    const [categories, setCategories] = useState(() => {
        return JSON.parse(localStorage.getItem("categories")) || [];
    });
    const [newBook, setNewBook] = useState({
        name: "", author: "", price: "", categoryId: "", image: "",
    });
    useEffect(() => {
        const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
        const storedCategories = JSON.parse(localStorage.getItem("categories")) || [];
        setBooks(storedBooks);
        setCategories(storedCategories);
    }, []);

    useEffect(() => {
        localStorage.setItem("books", JSON.stringify(books));
    }, [books]);

    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories));
    }, [categories]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handleCategoryChange = (value) => {
        setNewBook({ ...newBook, categoryId: value });
    };

    const handleFileChange = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setNewBook({ ...newBook, image: e.target.result });
        };
        reader.readAsDataURL(file);
        return false;
    };

    const filteredBooks = books.filter((book) => {
        const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? book.categoryId === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    const addBook = () => {
        if (!newBook.name || !newBook.author || !newBook.price || !newBook.categoryId) {
            message.error("vui lòng điền đầy đủ thông tin sách!");
            return;
        }
        const book = { ...newBook, id: uuidv4() };
        setBooks([...books, book]);
        setNewBook({ name: "", author: "", price: "", categoryId: "", image: "" });
        message.success("Thêm sách thành công!");
    };

    const handleEditBook = (book) => {
        setIsEditing(true);
        setEditingBook(book);
        setNewBook({
            name: book.name,
            author: book.author,
            price: book.price,
            categoryId: book.categoryId,
            image: book.image,
        });
    };

    const saveChanges = () => {
        if (!newBook.name || !newBook.author || !newBook.price || !newBook.categoryId) {
            message.error("Vui lòng điền đầy đủ thông tin sách!");
            return;
        }

        setBooks((prevBooks) =>
            prevBooks.map((book) =>
                book.id === editingBook.id ? { ...editingBook, ...newBook } : book
            )
        );

        message.success("Cập nhật sách thành công!");
        setIsEditing(false);
        setEditingBook(null);
        setNewBook({ name: "", author: "", price: "", categoryId: "", image: "" });
    };

    const deleteBook = (id) => {
        setBooks(books.filter((book) => book.id !== id));
        message.success("Xóa thành công!");
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditingBook(null);
        setNewBook({ name: "", author: "", price: "", categoryId: "", image: "" });
    };

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Tên sách", dataIndex: "name", key: "name" },
        { title: "Tác giả", dataIndex: "author", key: "author" },
        {
            title: "Danh mục",
            key: "categoryId",
            render: (record) => categories.find((cat) => cat.id === record.categoryId)?.name || "N/A",
        },
        { title: "Giá", dataIndex: "price", key: "price" },
        {
            title: "Hình ảnh",
            key: "image",
            render: (_, record) => <img src={record.image} alt="Book" style={{ width: "50px" }} />,
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => handleEditBook(record)}>
                        Cập nhật
                    </Button>
                    <Button danger onClick={() => deleteBook(record.id)}>
                        Xóa
                    </Button>
                </div>
            ),
        },
    ];

    return (
       
        
        <div>
            <h2 class="text-2xl font-bold mb-4">Quản lý sách</h2>
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <Input
                    placeholder="Tìm kiếm theo tên sách"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "300px" }}
                />
                <Select
                    placeholder="Lọc theo danh mục"
                    value={filterCategory || undefined}
                    onChange={(value) => setFilterCategory(value)}
                    allowClear
                    style={{ width: "200px" }}
                >
                    {categories.map((cat) => (
                        <Option key={cat.id} value={cat.id}>
                            {cat.name}
                        </Option>
                    ))}
                </Select>
            </div>
            <Input placeholder="Tên sách" name="name" value={newBook.name}
                onChange={handleInputChange} style={{ width: "300px", marginRight: "10px" }} />
            <Input placeholder=" Tác giả" name="author" value={newBook.author}
                onChange={handleInputChange} style={{ width: "300px", marginRight: "10px" }} />
            <Input placeholder=" Giá sách" name="price" value={newBook.price}
                onChange={handleInputChange} style={{ width: "150px", marginRight: "10px" }} />
            <Select
                placeholder="Chọn danh mục"
                onChange={handleCategoryChange}
                value={newBook.categoryId || undefined}
                style={{ width: "200px", marginRight: "10px" }}
            >
                {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                        {cat.name}
                    </Option>
                ))}
            </Select>
            <Upload beforeUpload={handleFileChange} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
            <Button type="primary" onClick={isEditing ? saveChanges : addBook} style={{ marginLeft: "10px" }}>
                {isEditing ? "Lưu thay đổi" : "Thêm sách"}
            </Button>
            {isEditing && (
                <Button onClick={cancelEdit} style={{ marginLeft: "10px" }}>
                    Hủy
                </Button>
            )}
           <Table dataSource={filteredBooks} columns={columns} rowKey="id" style={{ marginTop: "20px" }} />
        </div>
        
    );
};
