// --- Constants and Enums ---
/**
 * 商品のカテゴリを定義する列挙型。
 */
var ProductCategory;
(function (ProductCategory) {
    ProductCategory["Electronics"] = "Electronics";
    ProductCategory["Books"] = "Books";
    ProductCategory["HomeAppliances"] = "Home Appliances";
    ProductCategory["Clothing"] = "Clothing";
    ProductCategory["Food"] = "Food";
    ProductCategory["Sports"] = "Sports";
})(ProductCategory || (ProductCategory = {}));
/**
* 注文のステータスを定義する列挙型。
*/
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["Pending"] = "Pending";
    OrderStatus["Processing"] = "Processing";
    OrderStatus["Shipped"] = "Shipped";
    OrderStatus["Delivered"] = "Delivered";
    OrderStatus["Cancelled"] = "Cancelled";
})(OrderStatus || (OrderStatus = {}));
/**
* ユーザーの役割を定義する列挙型。
*/
var UserRole;
(function (UserRole) {
    UserRole["Customer"] = "Customer";
    UserRole["Admin"] = "Admin";
    UserRole["Seller"] = "Seller";
})(UserRole || (UserRole = {}));
/**
* 支払い方法を定義する列挙型。
*/
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CreditCard"] = "Credit Card";
    PaymentMethod["PayPal"] = "PayPal";
    PaymentMethod["BankTransfer"] = "Bank Transfer";
    PaymentMethod["CashOnDelivery"] = "Cash on Delivery";
})(PaymentMethod || (PaymentMethod = {}));
// --- Classes (Data Models and Services) ---
/**
* シンプルなデータストアのモック。
*/
class InMemoryDatabase {
    collection;
    constructor() {
        this.collection = new Map();
    }
    add(item) {
        const id = `entity_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const now = new Date();
        const newItem = { ...item, id, createdAt: now, updatedAt: now };
        this.collection.set(id, newItem);
        console.log(`[LOG] Added item to collection: ${id}`); // デコレーターの代わりにログを追加
        return newItem;
    }
    get(id) {
        const result = this.collection.get(id);
        console.log(`[LOG] Get item by ID '${id}': ${result ? 'found' : 'not found'}`); // デコレーターの代わりにログを追加
        return result;
    }
    getAll() {
        const result = Array.from(this.collection.values());
        console.log(`[LOG] Get all items. Count: ${result.length}`); // デコレーターの代わりにログを追加
        return result;
    }
    update(id, updates) {
        const existing = this.collection.get(id);
        if (!existing) {
            console.log(`[LOG] Update item ID '${id}': not found`); // デコレーターの代わりにログを追加
            return undefined;
        }
        const updatedItem = { ...existing, ...updates, updatedAt: new Date() };
        this.collection.set(id, updatedItem);
        console.log(`[LOG] Update item ID '${id}': success`); // デコレーターの代わりにログを追加
        return updatedItem;
    }
    delete(id) {
        const result = this.collection.delete(id);
        console.log(`[LOG] Delete item ID '${id}': ${result ? 'success' : 'failed'}`); // デコレーターの代わりにログを追加
        return result;
    }
    findBy(key, value) {
        const result = Array.from(this.collection.values()).filter(item => item[key] === value);
        console.log(`[LOG] Find items by key '${String(key)}' with value '${value}'. Found: ${result.length}`); // デコレーターの代わりにログを追加
        return result;
    }
}
// 各エンティティ用のデータストアインスタンス
const usersDb = new InMemoryDatabase();
const productsDb = new InMemoryDatabase();
const ordersDb = new InMemoryDatabase();
const reviewsDb = new InMemoryDatabase();
const paymentsDb = new InMemoryDatabase();
/**
* ユーザー関連のロジックを処理するサービス。
*/
class UserService {
    db;
    constructor(db) {
        this.db = db;
    }
    async registerUser(userData) {
        console.log(`[LOG] Method 'registerUser' called.`); // デコレーターの代わりにログを追加
        const existingUser = this.db.findBy('username', userData.username);
        if (existingUser.length > 0) {
            return { success: false, error: 'Username already exists.' };
        }
        // パスワードのハッシュ化（実際にはもっと複雑な処理が必要）
        userData.passwordHash = `hashed_${userData.passwordHash}_${Date.now()}`;
        const newUser = this.db.add(userData);
        return { success: true, data: newUser };
    }
    async authenticateUser(credentials) {
        console.log(`[LOG] Method 'authenticateUser' called.`); // デコレーターの代わりにログを追加
        const users = this.db.findBy('username', credentials.username);
        const user = users[0];
        if (!user) {
            return { success: false, error: 'User not found.' };
        }
        // パスワードの比較（実際にはハッシュの比較）
        if (user.passwordHash === `hashed_${credentials.passwordHash}_${user.createdAt.getTime()}`) { // 簡易比較
            return { success: true, data: user };
        }
        return { success: false, error: 'Invalid credentials.' };
    }
    getUserProfile(userId) {
        console.log(`[LOG] Method 'getUserProfile' called.`); // デコレーターの代わりにログを追加
        const user = this.db.get(userId);
        if (!user) {
            return { success: false, error: 'User not found.' };
        }
        // パスワードハッシュを含まない形で返す
        const { passwordHash, ...safeUser } = user;
        return { success: true, data: safeUser };
    }
    updateUserProfile(userId, updates) {
        console.log(`[LOG] Method 'updateUserProfile' called.`); // デコレーターの代わりにログを追加
        const updatedUser = this.db.update(userId, updates);
        if (!updatedUser) {
            return { success: false, error: 'User not found.' };
        }
        const { passwordHash, ...safeUser } = updatedUser;
        return { success: true, data: safeUser };
    }
}
/**
* 商品関連のロジックを処理するサービス。
*/
class ProductService {
    db;
    constructor(db) {
        this.db = db;
    }
    async addProduct(productData) {
        console.log(`[LOG] Method 'addProduct' called.`); // デコレーターの代わりにログを追加
        if (productData.price <= 0 || productData.stock < 0) {
            return { success: false, error: 'Price and stock must be positive.' };
        }
        const newProduct = this.db.add(productData);
        return { success: true, data: newProduct };
    }
    getProduct(productId) {
        console.log(`[LOG] Method 'getProduct' called.`); // デコレーターの代わりにログを追加
        const product = this.db.get(productId);
        if (!product) {
            return { success: false, error: 'Product not found.' };
        }
        return { success: true, data: product };
    }
    getAllProducts(category) {
        console.log(`[LOG] Method 'getAllProducts' called.`); // デコレーターの代わりにログを追加
        let products = this.db.getAll();
        if (category) {
            products = products.filter(p => p.category === category);
        }
        return { success: true, data: products };
    }
    updateProduct(productId, updates) {
        console.log(`[LOG] Method 'updateProduct' called.`); // デコレーターの代わりにログを追加
        const updatedProduct = this.db.update(productId, updates);
        if (!updatedProduct) {
            return { success: false, error: 'Product not found.' };
        }
        return { success: true, data: updatedProduct };
    }
    deleteProduct(productId, adminId) {
        console.log(`[LOG] Method 'deleteProduct' called.`); // デコレーターの代わりにログを追加
        const product = this.db.get(productId);
        if (!product) {
            return { success: false, error: 'Product not found.' };
        }
        // 通常はadminIdのロールチェックが必要
        if (this.db.delete(productId)) {
            return { success: true, data: true, message: 'Product deleted successfully.' };
        }
        return { success: false, error: 'Failed to delete product.' };
    }
}
/**
* 注文関連のロジックを処理するサービス。
*/
class OrderService {
    ordersDb;
    productsDb;
    usersDb;
    constructor(ordersDb, productsDb, usersDb) {
        this.ordersDb = ordersDb;
        this.productsDb = productsDb;
        this.usersDb = usersDb;
    }
    async createOrder(userId, items, shippingAddress, paymentMethod) {
        console.log(`[LOG] Method 'createOrder' called.`); // デコレーターの代わりにログを追加
        const user = this.usersDb.get(userId);
        if (!user) {
            return { success: false, error: 'User not found.' };
        }
        const orderItems = [];
        let totalAmount = 0;
        for (const item of items) {
            const product = this.productsDb.get(item.productId);
            if (!product) {
                return { success: false, error: `Product with ID ${item.productId} not found.` };
            }
            if (product.stock < item.quantity) {
                return { success: false, error: `Not enough stock for product '${product.name}'. Available: ${product.stock}, Requested: ${item.quantity}.` };
            }
            orderItems.push({
                productId: product.id,
                productName: product.name,
                quantity: item.quantity,
                priceAtOrder: product.price
            });
            totalAmount += product.price * item.quantity;
            // 在庫を減らす
            this.productsDb.update(product.id, { stock: product.stock - item.quantity });
        }
        const newOrder = {
            userId,
            items: orderItems,
            totalAmount,
            status: OrderStatus.Pending,
            shippingAddress,
            paymentMethod,
            paymentStatus: 'Unpaid'
        };
        const createdOrder = this.ordersDb.add(newOrder);
        return { success: true, data: createdOrder };
    }
    getOrder(orderId) {
        console.log(`[LOG] Method 'getOrder' called.`); // デコレーターの代わりにログを追加
        const order = this.ordersDb.get(orderId);
        if (!order) {
            return { success: false, error: 'Order not found.' };
        }
        return { success: true, data: order };
    }
    getUserOrders(userId) {
        console.log(`[LOG] Method 'getUserOrders' called.`); // デコレーターの代わりにログを追加
        const orders = this.ordersDb.findBy('userId', userId);
        return { success: true, data: orders };
    }
    updateOrderStatus(orderId, newStatus) {
        console.log(`[LOG] Method 'updateOrderStatus' called.`); // デコレーターの代わりにログを追加
        const updatedOrder = this.ordersDb.update(orderId, { status: newStatus });
        if (!updatedOrder) {
            return { success: false, error: 'Order not found.' };
        }
        // ステータスに応じた追加処理（例：発送日設定など）
        if (newStatus === OrderStatus.Shipped && !updatedOrder.shippedDate) {
            this.ordersDb.update(orderId, { shippedDate: new Date() });
        }
        else if (newStatus === OrderStatus.Delivered && !updatedOrder.deliveredDate) {
            this.ordersDb.update(orderId, { deliveredDate: new Date() });
        }
        else if (newStatus === OrderStatus.Cancelled) {
            // キャンセル時の在庫戻し処理など
            for (const item of updatedOrder.items) {
                const product = this.productsDb.get(item.productId);
                if (product) {
                    this.productsDb.update(product.id, { stock: product.stock + item.quantity });
                }
            }
        }
        return { success: true, data: this.ordersDb.get(orderId) }; // 更新された最新のものを返す
    }
}
/**
* 支払い関連のロジックを処理するサービス。
*/
class PaymentService {
    paymentsDb;
    ordersDb;
    constructor(paymentsDb, ordersDb) {
        this.paymentsDb = paymentsDb;
        this.ordersDb = ordersDb;
    }
    async processPayment(orderId, userId, amount, method) {
        console.log(`[LOG] Method 'processPayment' called.`); // デコレーターの代わりにログを追加
        const order = this.ordersDb.get(orderId);
        if (!order || order.userId !== userId || order.totalAmount !== amount || order.paymentStatus === 'Paid') {
            return { success: false, error: 'Invalid order or order already paid.' };
        }
        // ここで実際の支払いゲートウェイとの連携をシミュレート
        const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        const status = Math.random() > 0.1 ? 'Success' : 'Failed'; // 90%の確率で成功
        const newPayment = {
            orderId,
            userId,
            amount,
            method,
            transactionId,
            status
        };
        const createdPayment = this.paymentsDb.add(newPayment);
        if (status === 'Success') {
            // 注文の支払いステータスを更新
            this.ordersDb.update(orderId, { paymentStatus: 'Paid', status: OrderStatus.Processing });
            return { success: true, data: createdPayment, message: 'Payment successful!' };
        }
        else {
            return { success: false, error: 'Payment failed.', data: createdPayment };
        }
    }
    getPaymentHistory(userId) {
        console.log(`[LOG] Method 'getPaymentHistory' called.`); // デコレーターの代わりにログを追加
        const payments = this.paymentsDb.findBy('userId', userId);
        return { success: true, data: payments };
    }
}
/**
* レビュー関連のロジックを処理するサービス。
*/
class ReviewService {
    reviewsDb;
    productsDb;
    constructor(reviewsDb, productsDb) {
        this.reviewsDb = reviewsDb;
        this.productsDb = productsDb;
    }
    async submitReview(reviewData) {
        console.log(`[LOG] Method 'submitReview' called.`); // デコレーターの代わりにログを追加
        if (reviewData.rating < 1 || reviewData.rating > 5) {
            return { success: false, error: 'Rating must be between 1 and 5.' };
        }
        const product = this.productsDb.get(reviewData.productId);
        if (!product) {
            return { success: false, error: 'Product not found for review.' };
        }
        const newReview = this.reviewsDb.add(reviewData);
        // 商品の平均評価とレビュー数を更新する（簡易的な計算）
        const productReviews = this.reviewsDb.findBy('productId', product.id);
        const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAverageRating = totalRating / productReviews.length;
        this.productsDb.update(product.id, {
            rating: parseFloat(newAverageRating.toFixed(1)),
            reviewsCount: productReviews.length
        });
        return { success: true, data: newReview };
    }
    getProductReviews(productId) {
        console.log(`[LOG] Method 'getProductReviews' called.`); // デコレーターの代わりにログを追加
        const reviews = this.reviewsDb.findBy('productId', productId);
        return { success: true, data: reviews };
    }
    getUserReviews(userId) {
        console.log(`[LOG] Method 'getUserReviews' called.`); // デコレーターの代わりにログを追加
        const reviews = this.reviewsDb.findBy('userId', userId);
        return { success: true, data: reviews };
    }
}
// --- Main Application / Simulation ---
// サービスインスタンスの作成
const userService = new UserService(usersDb);
const productService = new ProductService(productsDb);
const orderService = new OrderService(ordersDb, productsDb, usersDb);
const paymentService = new PaymentService(paymentsDb, ordersDb);
const reviewService = new ReviewService(reviewsDb, productsDb);
async function simulateECWorkflow() {
    console.log("--- ECサイトのバックエンド処理シミュレーション開始 ---");
    // 1. ユーザー登録とログイン
    console.log("\n--- ユーザー登録とログイン ---");
    const userResult = await userService.registerUser({
        username: "testuser",
        email: "test@example.com",
        passwordHash: "password123",
        role: UserRole.Customer,
        address: { street: "123 Main St", city: "Anytown", state: "CA", zipCode: "90210", country: "USA" }
    });
    let currentUser;
    if (userResult.success && userResult.data) {
        console.log("ユーザー登録成功:", userResult.data.username);
        currentUser = userResult.data;
        const loginResult = await userService.authenticateUser({ username: "testuser", passwordHash: "password123" });
        if (loginResult.success && loginResult.data) {
            console.log("ログイン成功:", loginResult.data.username);
        }
        else {
            console.error("ログイン失敗:", loginResult.error);
        }
    }
    else {
        console.error("ユーザー登録失敗:", userResult.error);
        return;
    }
    // 2. 商品の追加 (SellerやAdminの役割を想定)
    console.log("\n--- 商品の追加 ---");
    const product1Result = await productService.addProduct({
        name: "Wireless Headphones",
        description: "High-quality noise-cancelling headphones.",
        price: 199.99,
        category: ProductCategory.Electronics,
        stock: 50,
        imageUrl: "http://example.com/hp.jpg",
        sellerId: "seller_admin_1" // 仮のID
    });
    let headphoneProduct;
    if (product1Result.success && product1Result.data) {
        console.log("商品追加成功:", product1Result.data.name);
        headphoneProduct = product1Result.data;
    }
    else {
        console.error("商品追加失敗:", product1Result.error);
        return;
    }
    const product2Result = await productService.addProduct({
        name: "TypeScript Deep Dive",
        description: "Comprehensive guide to TypeScript.",
        price: 39.99,
        category: ProductCategory.Books,
        stock: 100,
        imageUrl: "http://example.com/ts_book.jpg",
        sellerId: "seller_admin_1"
    });
    let bookProduct;
    if (product2Result.success && product2Result.data) {
        console.log("商品追加成功:", product2Result.data.name);
        bookProduct = product2Result.data;
    }
    else {
        console.error("商品追加失敗:", product2Result.error);
        return;
    }
    // 3. 全商品とカテゴリ別商品の取得
    console.log("\n--- 商品リストの取得 ---");
    const allProductsResult = productService.getAllProducts();
    if (allProductsResult.success && allProductsResult.data) {
        console.log("全商品数:", allProductsResult.data.length);
    }
    const electronicsProductsResult = productService.getAllProducts(ProductCategory.Electronics);
    if (electronicsProductsResult.success && electronicsProductsResult.data) {
        console.log("家電製品数:", electronicsProductsResult.data.length);
    }
    // 4. 注文の作成
    console.log("\n--- 注文の作成 ---");
    if (currentUser && headphoneProduct && bookProduct) {
        const orderResult = await orderService.createOrder(currentUser.id, [
            { productId: headphoneProduct.id, quantity: 1 },
            { productId: bookProduct.id, quantity: 2 }
        ], currentUser.address, // 登録時に住所があるので必ず存在する
        PaymentMethod.CreditCard);
        let currentOrder;
        if (orderResult.success && orderResult.data) {
            console.log("注文作成成功。合計金額:", orderResult.data.totalAmount, "ステータス:", orderResult.data.status);
            currentOrder = orderResult.data;
            const updatedHeadphoneStock = productService.getProduct(headphoneProduct.id);
            console.log("ヘッドホンの新しい在庫:", updatedHeadphoneStock.success ? updatedHeadphoneStock.data?.stock : '取得失敗');
        }
        else {
            console.error("注文作成失敗:", orderResult.error);
            return;
        }
        // 5. 支払い処理
        console.log("\n--- 支払い処理 ---");
        if (currentOrder) {
            const paymentResult = await paymentService.processPayment(currentOrder.id, currentOrder.userId, currentOrder.totalAmount, currentOrder.paymentMethod);
            if (paymentResult.success && paymentResult.data) {
                console.log("支払い成功！トランザクションID:", paymentResult.data.transactionId);
                const updatedOrder = orderService.getOrder(currentOrder.id);
                console.log("支払後の注文ステータス:", updatedOrder.success ? updatedOrder.data?.status : '取得失敗');
            }
            else {
                console.error("支払い失敗:", paymentResult.error);
            }
        }
        // 6. 注文ステータスの更新（出荷、配達）
        console.log("\n--- 注文ステータスの更新 ---");
        if (currentOrder) {
            const shippedResult = await orderService.updateOrderStatus(currentOrder.id, OrderStatus.Shipped);
            if (shippedResult.success) {
                console.log("注文を出荷済みに更新:", shippedResult.data?.status);
            }
            const deliveredResult = await orderService.updateOrderStatus(currentOrder.id, OrderStatus.Delivered);
            if (deliveredResult.success) {
                console.log("注文を配達済みに更新:", deliveredResult.data?.status);
            }
        }
        // 7. 商品レビューの投稿
        console.log("\n--- 商品レビューの投稿 ---");
        if (currentUser && headphoneProduct) {
            const reviewResult = await reviewService.submitReview({
                productId: headphoneProduct.id,
                userId: currentUser.id,
                rating: 5,
                comment: "素晴らしい音質！デザインも気に入りました。"
            });
            if (reviewResult.success) {
                console.log("レビュー投稿成功。商品ID:", reviewResult.data?.productId);
                const updatedProduct = productService.getProduct(headphoneProduct.id);
                console.log("ヘッドホン商品の新しい評価:", updatedProduct.success ? updatedProduct.data?.rating : '取得失敗');
                console.log("ヘッドホン商品のレビュー数:", updatedProduct.success ? updatedProduct.data?.reviewsCount : '取得失敗');
            }
            else {
                console.error("レビュー投稿失敗:", reviewResult.error);
            }
        }
    }
    else {
        console.error("必要な情報が不足しているため、注文処理をスキップしました。");
    }
    console.log("\n--- ECサイトのバックエンド処理シミュレーション終了 ---");
}
// シミュレーション実行
simulateECWorkflow();
// 型ガードの例
function isProduct(obj) {
    return obj.category !== undefined;
}
const unknownItem = { name: "テスト", price: 100, category: ProductCategory.Books };
if (isProduct(unknownItem)) {
    console.log(`\n型ガード：これは商品です。カテゴリ: ${unknownItem.category}`);
}
// Generic Utility Functionの例
function safeParseJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    }
    catch (e) {
        console.error("JSONパースエラー:", e);
        return null;
    }
}
const jsonProduct = '{"id": "prod_1", "name": "Generic Item", "description": "...", "price": 10.0, "category": "Electronics", "stock": 5, "imageUrl": "url", "sellerId": "seller1", "createdAt": "2023-01-01T00:00:00Z", "updatedAt": "2023-01-01T00:00:00Z"}';
const parsedProduct = safeParseJSON(jsonProduct);
if (parsedProduct) {
    console.log("Generic Utility Function: パースされた商品名:", parsedProduct.name);
}
