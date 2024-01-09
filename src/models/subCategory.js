const { Category, SubCategory } = require("./Category");

// Category "Nội thất" và các sub-categories của nó
const furnitureCategory = new Category({
    name: "Nội thất",
    subCategories: [
        { name: "Bàn, ghế" },
        { name: "Tủ, kệ" },
        { name: "Giường, chăn ga gối nệm" },
        { name: "Khác" },
    ],
});

// Category "Đồ điện tử" và các sub-categories của nó
const electronicsCategory = new Category({
    name: "Đồ điện tử",
    subCategories: [
        { name: "Điện thoại" },
        { name: "Máy tính bảng" },
        { name: "Máy tính" },
        { name: "Tivi" },
        { name: "Loa, tai nghe" },
        { name: "Khác" },
    ],
});

// Category "Đồ dùng cá nhân" và các sub-categories của nó
const belongingsCategory = new Category({
    name: "Đồ dùng cá nhân",
    subCategories: [
        { name: "Quần áo" },
        { name: "Giày dép" },
        { name: "Đồng hồ" },
        { name: "Balo, túi xách" },
        { name: "Khác" },
    ],
});

const booksCategory = new Category({
    name: "Đồ dùng cá nhân",
    subCategories: [
        { name: "Văn học Việt Nam" },
        { name: "Văn học nước ngoài" },
        { name: "Truyện tranh" },
        { name: "Sách giáo khoa" },
        { name: "Khác" },
    ],
});

// Lưu các categories và sub-categories vào cơ sở dữ liệu
furnitureCategory.save(function (err, savedFurnitureCategory) {
    if (err) return console.error(err);
    console.log(
        'Category "Nội thất" đã được lưu vào cơ sở dữ liệu:',
        savedFurnitureCategory
    );
});

electronicsCategory.save(function (err, savedElectronicsCategory) {
    if (err) return console.error(err);
    console.log(
        'Category "Đồ điện tử" đã được lưu vào cơ sở dữ liệu:',
        savedElectronicsCategory
    );
});

belongingsCategory.save(function (err, SaveBelongingsCategory) {
    if (err) return console.error(err);
    console.log(
        'Category "Đồ dùng cá nhân" đã được lưu vào cơ sở dữ liệu:',
        SaveBelongingsCategory
    );
});
