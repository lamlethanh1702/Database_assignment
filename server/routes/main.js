import express from "express";
import ejs from "ejs";
import { Post, member, feedback, manager, publisher, Category, containbooks, rate, warehouse, searching , orders} from "../models/post_sql.js";
import { Sequelize, DataTypes } from "sequelize";
 import bodyParser from 'body-parser';
import bcrypt from "bcrypt";
import { nextTick } from "async";


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json())



let user_name = ''
let user_id = ''
let content_error = ''
let roll = ''
let carts = []
let content_btn = 'Login'

let total_member = await member.count();
let view_history = await orders.sequelize.query(`
    SELECT *
    FROM orders
`);

let total_category = await Category.count();

// Fetch all books from the Post model
const new_arrivals = await Post.findAll({order: [['BookID', 'DESC']]});
// console.log(new_arrivals)

const [bestSeller] = await Post.sequelize.query(`
    SELECT BookID, SUM(Book_Quantity) AS TotalSold
    FROM ContainBooks
    GROUP BY BookID
    ORDER BY TotalSold DESC
    LIMIT 3;
`);
const bestSellerBookIDs = bestSeller.map(book => book.BookID);
const books = await Post.findAll({
    where: {
        BookID: bestSellerBookIDs
    }
});

router.get('/', async (req, res) => {
    try {

        // Pass the new_arrivals data to the EJS template
        res.render('index.ejs', { 
            new_arrivals, 
            books, 
            content_btn: content_btn, 
            user_name: user_name,
            roll: roll
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching new_arrivals.");
    }
});



router.get('/login', async (req, res) => {
    if (content_btn === 'Log-out') {
        content_btn = 'Log-in'
        res.redirect('/')
    }
    else {
        res.render('login.ejs', {content_error: content_error});
    }
    
    // res.render('login.ejs');
})

router.get('/register', (req,res) => {
    res.render('register.ejs')
})

router.get('/cart', (req,res) => {
    res.render('cart.ejs', {
        carts,
        content_btn: content_btn, 
        user_name: user_name,
        roll: roll
    });
})

router.post('/cart', async (req, res) => {
    carts = [];
    res.redirect('/cart');
})

// router.get('/', async(req, res) => {
//     try {
//         const books = await Post.
//     }
// })

// router.get('/', async (req, res) => {
//     try {
//         // Fetch the best-selling book
//         const [bestSeller] = await Post.sequelize.query(`
//             SELECT BookID, SUM(Book_Quantity) AS TotalSold
//             FROM ContainBooks
//             GROUP BY BookID
//             ORDER BY TotalSold DESC
//             LIMIT 3;
//         `);

//         // Log the result for debugging
//         console.log(bestSeller);
//         const bestSellerBookIDs = bestSeller.map(book => book.BookID);
//         const books = await Post.findAll({
//             where: {
//                 BookID: bestSellerBookIDs
//             }
//         });

//         // Pass the result to the EJS template
//         res.render('index.ejs', { books });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("An error occurred while fetching the best-selling book.");
//     }
// });


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log(username)
        // console.log(password)
        content_error = ''
        // Find user by username
        const user = await member.findOne({ where: { username: { [Sequelize.Op.eq]: username } } });
        const admin = await manager.findOne({ where: { username: { [Sequelize.Op.eq]: username } } });
        if (user) {
            // Compare the input password with the hashed password in the database
            const isMatch = password === user.password
            console.log(user)
            if (isMatch) {
                content_btn = 'Log-out'
                user_name = user.Member_Name
                user_id = user.MemberID
                roll = 'Member'
                console.log(user_id)
                // Render index.ejs if the credentials match
                return res.redirect('/');
            } else {
                // Password mismatch
                content_error= 'Invalid username or password'
                return res.redirect('/login')
            }
        
        } else if (admin) {
            const isMatch = password === admin.password
            console.log(admin)
            if (isMatch) {
                content_btn = 'Log-out'
                user_name = admin.Manager_Name
                roll = 'Manager'
                // Render index.ejs if the credentials match
                return res.redirect('/admin');
            } else {
                // Password mismatch
                content_error= 'Invalid username or password'
                return res.redirect('/login')
            }
        }else {
            // User not found
            content_error= 'Invalid username or password'
            return res.redirect('/login')
        }
    } catch (error) {
        console.error(error);
        // Redirect to login page on error
        content_error= 'Something went wrong'
        return res.redirect('/login')
    }
});

router.post('/register', async (req, res) => {
    try {
        const { name, username, password, email, address, contact_number } = req.body;
        console.log(name, username, password, email, address, contact_number)

        await member.sequelize.query(`
            INSERT INTO member (MemberID, Member_Name, username, password, Member_Email, Member_Address, Member_ContactNumber )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, {
            replacements: [`MB${++total_member}`,name, username, password, email, address, contact_number]
        });
        return res.redirect('/login')
    } catch (error) {
        console.error(error);
        // Redirect to login page on error
        content_error= 'Something went wrong'
        return res.redirect('/register')
    }
})

router.post('/search', async(req, res) => {
    try {
        const searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        const searchValue = `%${searchNoSpecialChar}%`;
        const datas = await Post.findAll({where: {
            [Sequelize.Op.or]: [
                {Title: {[Sequelize.Op.like]: searchValue}},
                {Author: {[Sequelize.Op.like]: searchValue}}
            ],
        }})
        res.render('search.ejs', {
            datas, 
            content_btn: content_btn,
            user_name: user_name,
            roll: roll
        });
    } catch (error) {
        console.error("Error occurred during search:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post('/categories', async (req, res) => {
    try {
        const selectedCategory = req.body.category;
        let datas = []
        if (selectedCategory === 'fantasy' || selectedCategory === 'detective' || selectedCategory === 'novel' ) {
            datas = await Post.sequelize.query(`
                SELECT b.*
                FROM Book b
                JOIN Category c ON b.CategoryID = c.CategoryID
                WHERE c.Category_Name = '${selectedCategory}'
        `   , {
                replacements: { categoryName: selectedCategory },
                type: Post.sequelize.QueryTypes.SELECT
            });
        } else {
            let temp = 'ASC';
            if (selectedCategory === 'decreasing_price') temp = 'DESC';
            datas = await Post.sequelize.query(`
                SELECT * 
                FROM Book 
                ORDER BY Book_Price ${temp};
        `   , {
                replacements: { categoryName: selectedCategory },
                type: Post.sequelize.QueryTypes.SELECT
            });
        }
        
        res.render('search.ejs', {
            datas,
            content_btn: content_btn,
            user_name: user_name,
            roll: roll
        });
    } catch (error) {
        console.error("Error occurred during search:", error);
        res.status(500).json({ error: "Internal server error" });
    }
    
    // res.send(`You selected: ${selectedCategory}`);
});

router.post('/add-to-cart', async (req, res) => {
    // const { BookID, Title, Book_Price } = req.body;
    const BookID = req.body.bookID;
    const Title = req.body.title;
    const Book_Price = req.body.book_price;
    console.log(BookID, Title, Book_Price)
    // Check if the book is already in the carts
    const existingItem = carts.find((item) => item.BookID === BookID);
    if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if already in carts
    } else {
        // Add new book to carts
        carts.push({ 
            BookID, 
            Title, 
            Book_Price: parseFloat(Book_Price), 
            quantity: 1 
        });
    }
    console.log(carts);
    res.redirect('/cart'); // Redirect to the carts page
});

router.post('/submit-cart', async (req, res) => {
    try {
        let total_order = await orders.count();
        console.log(total_order)
        const { total } = req.body;
        console.log(user_id)
        console.log(total);
        if (user_id === '') {
            return res.redirect('/cart?error=You need to login to buy books');
        }
        else {
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1; // Months are zero-based
            const year = today.getFullYear();

            const formattedDate = `${year}-${month}-${day}`;
            console.log(formattedDate);

            console.log('OrderID:', `OR${total_order}`);
            console.log('Order_date:', formattedDate);
            console.log('Total_Price:', total);
            console.log('MemberID:', user_id);
            console.log('ManagerID:', 'MN1');
        
            await orders.sequelize.query(`
                INSERT INTO orders (OrderID, Order_date, Total_Price, MemberID, ManagerID)
                VALUES (?, ?, ?, ?, ?)
            `, {
                replacements: [`OR${++total_order}`, formattedDate, parseFloat(total), user_id, 'MN1']
            });

            let view_history = await orders.findAll({
                attributes: ['OrderID', 'Order_date', 'Total_Price', 'MemberID', 'ManagerID'] // List only the columns that exist in the table
            });
            res.render('view_history.ejs', {
                view_history,
                content_btn: content_btn, 
                user_name: user_name,
                roll: roll
            })
        }
    } catch (error) {
        console.error("Error occurred during search:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}) 

router.get('/book-detail/:id', async (req, res) => {
    try {
       let slug = req.params.id;

       const data = await Post.findOne({where: {BookID: slug}})
       const publisher_book = await publisher.findOne({where: {publisherID: data.PublisherID}})
    //    console.log(data.BookID)
       res.render('bookdetail.ejs', {
            data: data,
            publisher: publisher_book,
            content_btn: content_btn, 
            user_name: user_name,
            roll: roll
       })
    } catch (error) {
        console.error("Error occurred during search:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.post('/book_feedback', async (req, res) => {
    try {
        // let slug = req.params.id;
        // const data = await Post.findOne({where: {BookID: slug}})
        const { bookid, rate_user, feedback_user } = req.body;
        console.log(rate_user, feedback_user, bookid)
        let total_feedback = await feedback.count()
        await feedback.sequelize.query(`
            INSERT INTO feedback (FeedbackID, Stars, Comments, BookID, MemberID )
            VALUES (?, ?, ?, ?, ?)
        `, {
            replacements: [`MB${++total_feedback}`,rate_user, feedback_user, bookid, user_id]
        });
        return res.redirect('/')
    } catch (error) {
        console.error(error);
        // Redirect to login page on error
        content_error= 'Something went wrong'
        return res.redirect('/register')
    }
})

// MANAGER

router.get('/admin', async (req, res) => {
    try {

        // Pass the new_arrivals data to the EJS template
        res.render('manager.ejs', { 
            new_arrivals, 
            books, 
            content_btn: content_btn, 
            user_name: user_name,
            roll: roll
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching new_arrivals.");
    }
})

router.get('/admin/updatebook', async(req,res) => {
    try {

        // Pass the new_arrivals data to the EJS template
        res.render('update_book.ejs', { 
            new_arrivals, 
            books, 
            content_btn: content_btn, 
            user_name: user_name,
            roll: roll
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while fetching new_arrivals.");
    }
})

router.post('/update-book', async (req, res) => {
    try {
        let temp = total_category
        const { bookID, warehouseID, title, author, price, category, publisherID, quantity } = req.body;
        console.log( bookID, warehouseID, title, author, price, category, publisherID, quantity)
        const link_image = '';
        let ID = "";
        const categories = await Category.sequelize.query(`
            SELECT *
            FROM Category
            WHERE Category_Name = '${category}'
    `   , {
            replacements: { Category_Name: category },
            type: Category.sequelize.QueryTypes.SELECT
        });
        if (categories.length > 0) {
            // Category exists, get its categoryID
            ID = categories[0].CategoryID; // Assuming Category_ID is the column name for ID
        } else {
            // Category does not exist, generate a new ID
            ID = `C${++temp}`
            await Category.sequelize.query(`
                INSERT INTO Category (CategoryID, Category_Name )
                VALUES (?, ?)
            `, {
                replacements: [ID, category]
            });

        }
        console.log(temp)
        console.log(total_category)
        console.log(ID)
        await Post.sequelize.query(`
            INSERT INTO Book (BookID, link_image, Title, Author, Quantity_remain, Book_Price, CategoryID, PublisherID, WID )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, {
            replacements: [bookID, link_image, title, author, quantity, price, ID, publisherID, warehouseID]
        });

        return res.redirect('/admin')
    } catch (error) {
        console.error(error);
        // Redirect to login page on error
        content_error= 'Something went wrong'
        return res.redirect('/register')
    }
})

router.post('/delete-book', async (req, res) => {
    try {
        const delete_book = req.body.delete_book
        console.log(delete_book)
        const find_book = await Post.sequelize.query(`
            SELECT *
            FROM book
            WHERE BookID = '${delete_book}'
    `   , {
            replacements: { BookID: delete_book },
            type: Post.sequelize.QueryTypes.SELECT
        });
        if (find_book.length > 0) {
            // Category exists, get its categoryID
            await containbooks.sequelize.query(`
                DELETE FROM containbooks
                WHERE BookID = ?
            `, {
                replacements: [delete_book]
            });

            await rate.sequelize.query(`
                DELETE FROM rate
                WHERE BookID = ?
            `, {
                replacements: [delete_book]
            });

            await feedback.sequelize.query(`
                DELETE FROM feedback
                WHERE BookID = ?
            `, {
                replacements: [delete_book]
            });

            await searching.sequelize.query(`
                DELETE FROM search
                WHERE BookID = ?
            `, {
                replacements: [delete_book]
            });

            // Then delete the book
            await Post.sequelize.query(`
                DELETE FROM book
                WHERE BookID = ?
            `, {
                replacements: [delete_book]
            });

            console.log('Delete successfully')
            //ID = categories[0].CategoryID; // Assuming Category_ID is the column name for ID
            console.log('YES')
        } else {
            
            console.log(`No book is found with bookID ${delete_book}`)

        }
        
        return res.redirect('/admin')
    } catch (error) {
        console.error(error);
        // Redirect to login page on error
        content_error= 'Something went wrong'
        return res.redirect('/register')
    }
    
})

router.get('/view_order', async (req, res) => {
    let view_history = []
    if (roll === 'Member') {
        view_history = await orders.sequelize.query(`
            SELECT *
            FROM orders
            WHERE MemberID = '${user_id}'
    `   , {
            replacements: { MemberID: user_id },
            type: orders.sequelize.QueryTypes.SELECT
        });
        console.log(view_history);
        res.render('view_history.ejs', {
            view_history,
            content_btn: content_btn, 
            user_name: user_name,
            roll: roll
        })
    } else if (roll === 'Manager') {
        let count_order = await orders.count()
        if (count_order > 0) {
            view_history = await orders.findAll({
                attributes: ['OrderID', 'Order_date', 'Total_Price', 'MemberID', 'ManagerID'] // List only the columns that exist in the table
            });
            console.log(view_history)
            res.render('view_history.ejs', {
                view_history,
                content_btn: content_btn, 
                user_name: user_name,
                roll: roll
            })
            console.log('YES')
        } else {
            console.log('NO')
            res.send("<h2>No order from customers</h2>")
        }
    }
    
    // console.log(view_history)
})


export default router;

// router.post('/check', async(req,res) => {

// })