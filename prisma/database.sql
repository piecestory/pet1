-- ==========================================================
-- قاعدة بيانات موقع "قطعة وقصة" | Piece & Story
-- ملف SQL كامل وجاهز للرفع المباشر (عبر phpMyAdmin أو أي أداة MySQL)
-- يطابق تمامًا محتوى prisma/schema.prisma الحالي (شامل الجداول الجديدة
-- الخاصة بلوحة الوسائط والمحتوى)
--
-- الاستخدام:
--   1) أنشئ قاعدة بيانات MySQL فارغة على استضافتك (مثل Hostinger).
--   2) استورد هذا الملف كاملاً عبر phpMyAdmin > Import، أو:
--        mysql -u USER -p DBNAME < database.sql
--   3) عدّل DATABASE_URL في .env لتشير لنفس القاعدة.
--   4) شغّل: npx prisma generate  (لا حاجة لعمل migrate لأن الجداول
--      أصبحت موجودة فعليًا بعد الاستيراد).
--
-- القسم الأول: إنشاء الجداول (DDL) — يطابق كل تفاصيل schema.prisma.
-- القسم الثاني: بيانات أولية اختيارية (مدير النظام + محتوى الصفحة
-- الرئيسية الحالي) بحيث يبقى شكل الموقع كما هو فور الربط، لحين
-- تعديله من لوحة التحكم. يمكن حذف القسم الثاني إن كانت القاعدة
-- ستُزرع لاحقًا عبر npm run prisma:seed بدلاً من ذلك.
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================================
-- القسم الأول: الجداول
-- ==========================================================

-- ---------------- المستخدمون ----------------
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'MANAGER', 'STAFF', 'CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- العناوين ----------------
CREATE TABLE `addresses` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `district` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `postal` VARCHAR(191) NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- التصنيفات ----------------
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(191) NULL,
    `parentId` VARCHAR(191) NULL,
    `order` INT NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- المنتجات ----------------
CREATE TABLE `products` (
    `id` VARCHAR(191) NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `shortDesc` TEXT NULL,
    `description` TEXT NULL,
    `story` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `compareAtPrice` DECIMAL(10, 2) NULL,
    `countryOfOrigin` VARCHAR(191) NULL,
    `era` VARCHAR(191) NULL,
    `material` VARCHAR(191) NULL,
    `dimensions` VARCHAR(191) NULL,
    `condition` VARCHAR(191) NULL,
    `stock` INT NOT NULL DEFAULT 1,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `isRare` BOOLEAN NOT NULL DEFAULT false,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `viewsCount` INT NOT NULL DEFAULT 0,
    `videoUrl` VARCHAR(191) NULL,
    `categoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `products_sku_key`(`sku`),
    UNIQUE INDEX `products_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- صور المنتجات ----------------
CREATE TABLE `product_images` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `altText` VARCHAR(191) NULL,
    `order` INT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- السلة ----------------
CREATE TABLE `cart` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `cart_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- المفضلة ----------------
CREATE TABLE `wishlist` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `wishlist_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- الطلبات ----------------
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `orderNumber` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `addressId` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `subtotal` DECIMAL(10, 2) NOT NULL,
    `shippingFee` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `taxAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `discount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `total` DECIMAL(10, 2) NOT NULL,
    `couponId` VARCHAR(191) NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `orders_orderNumber_key`(`orderNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- عناصر الطلب ----------------
CREATE TABLE `order_items` (
    `id` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `quantity` INT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- الكوبونات ----------------
CREATE TABLE `coupons` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `type` ENUM('PERCENTAGE', 'FIXED') NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `minOrder` DECIMAL(10, 2) NULL,
    `usageLimit` INT NULL,
    `usedCount` INT NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `coupons_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- عناصر المزادات ----------------
CREATE TABLE `auction_items` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `estimatedPrice` DECIMAL(10, 2) NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `auction_items_productId_key`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- طلبات الاهتمام بالمزادات ----------------
CREATE TABLE `auction_interest` (
    `id` VARCHAR(191) NOT NULL,
    `auctionItemId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `maxBudget` DECIMAL(10, 2) NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- طلبات الباحث الشخصي ----------------
CREATE TABLE `personal_shopper_requests` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `itemType` VARCHAR(191) NOT NULL,
    `era` VARCHAR(191) NULL,
    `countryOfOrigin` VARCHAR(191) NULL,
    `budget` DECIMAL(10, 2) NULL,
    `description` TEXT NOT NULL,
    `referenceImages` TEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'NEW',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- الإشعارات ----------------
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- الإعدادات (تشمل مفاتيح السكربتات: script_ga / script_meta_pixel / script_custom_head) ----------------
CREATE TABLE `settings` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `value` TEXT NOT NULL,

    UNIQUE INDEX `settings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- مكتبة الوسائط (جديد — لوحة إدارة الصور والملفات) ----------------
CREATE TABLE `media` (
    `id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `filename` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `size` INT NOT NULL,
    `altText` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- محتوى الصفحة الرئيسية (جديد — Hero + البانرات الترويجية) ----------------
CREATE TABLE `content_blocks` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `subtitle` TEXT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `linkUrl` VARCHAR(191) NULL,
    `linkText` VARCHAR(191) NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `content_blocks_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- آراء العملاء (جديد) ----------------
CREATE TABLE `testimonials` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `rating` INT NOT NULL DEFAULT 5,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INT NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------- شارات الثقة (جديد) ----------------
CREATE TABLE `trust_badges` (
    `id` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `order` INT NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ==========================================================
-- المفاتيح الأجنبية (Foreign Keys)
-- ==========================================================

ALTER TABLE `addresses` ADD CONSTRAINT `addresses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `categories` ADD CONSTRAINT `categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `products` ADD CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `product_images` ADD CONSTRAINT `product_images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `cart` ADD CONSTRAINT `cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `cart` ADD CONSTRAINT `cart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `wishlist` ADD CONSTRAINT `wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `orders` ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `orders` ADD CONSTRAINT `orders_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `addresses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `orders` ADD CONSTRAINT `orders_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `order_items` ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `auction_items` ADD CONSTRAINT `auction_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `auction_interest` ADD CONSTRAINT `auction_interest_auctionItemId_fkey` FOREIGN KEY (`auctionItemId`) REFERENCES `auction_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `auction_interest` ADD CONSTRAINT `auction_interest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `personal_shopper_requests` ADD CONSTRAINT `personal_shopper_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================================
-- القسم الثاني: بيانات أولية (اختياري) — احذف هذا القسم إن كنت
-- ستستخدم npm run prisma:seed بدلاً منه.
-- كلمة مرور المدير: Admin@12345 (غيّرها فور تسجيل الدخول الأول)
-- ==========================================================

INSERT INTO `users` (`id`, `name`, `email`, `passwordHash`, `role`) VALUES
(UUID(), 'مدير النظام', 'admin@qet3a-w-qesa.sa', '$2a$10$RenOrgqN3p7eLco.r/1oBeRIvo3WChPq94BKD0L1TV4JqfTmStbZK', 'SUPER_ADMIN');

INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `order`) VALUES
(UUID(), 'تحف وانتيك', 'antiques', '/images/cat-antiques.jpg', 0),
(UUID(), 'أواني منزلية', 'household', '/images/cat-household.jpg', 1),
(UUID(), 'قطع أثرية', 'rare-pieces', '/images/cat-rare.jpg', 2),
(UUID(), 'لوحات فنية', 'paintings', '/images/cat-paintings.jpg', 3),
(UUID(), 'أثاث كلاسيك', 'classic-furniture', '/images/cat-furniture.jpg', 4),
(UUID(), 'نجف وإضاءة', 'chandeliers', '/images/cat-chandeliers.jpg', 5);

INSERT INTO `content_blocks` (`id`, `key`, `title`, `subtitle`, `imageUrl`, `linkUrl`, `linkText`) VALUES
(UUID(), 'hero', 'حيث تلتقي الأصالة بالفخامة', 'اكتشف مجموعة مختارة بعناية من التحف والقطع النادرة المصممة لتروي قصة كل عصر.', '/images/hero-antique.jpg', '/shop', 'تصفح المتجر'),
(UUID(), 'promo_auction', 'المزادات الإلكترونية', 'شارك الآن واقتنِ القطع النادرة', '/images/promo-auction.jpg', '/auction', 'اكتشف المزادات'),
(UUID(), 'promo_shopper', 'الباحث الشخصي', 'نبحث لك عن القطعة التي تريدها', '/images/promo-shopper.jpg', '/personal-shopper', 'اطلب الآن');

INSERT INTO `testimonials` (`id`, `name`, `text`, `rating`, `order`) VALUES
(UUID(), 'سارة العتيبي', 'تجربة استثنائية، القطعة وصلت مغلفة بعناية فائقة وبنفس جودة الصور.', 5, 0),
(UUID(), 'خالد الشمري', 'خدمة الباحث الشخصي ساعدتني أجد قطعة كنت أبحث عنها منذ سنوات.', 5, 1),
(UUID(), 'منى الحربي', 'تعامل راقٍ ومنتجات أصلية، أنصح بالتعامل معهم بكل ثقة.', 5, 2);

INSERT INTO `trust_badges` (`id`, `icon`, `title`, `subtitle`, `order`) VALUES
(UUID(), 'truck', 'شحن سريع وآمن', 'داخل السعودية', 0),
(UUID(), 'gift', 'تغليف فاخر', 'وحماية مضمونة', 1),
(UUID(), 'shield-check', 'منتجات أصلية', '100% موثوقة', 2),
(UUID(), 'headphones', 'دعم العملاء', 'على مدار الساعة', 3),
(UUID(), 'package-check', 'إرجاع واستبدال', 'سهل وسريع', 4);

INSERT INTO `settings` (`id`, `key`, `value`) VALUES
(UUID(), 'store_name', 'قطعة وقصة'),
(UUID(), 'store_email', 'info@qet3a-w-qesa.sa'),
(UUID(), 'store_phone', ''),
(UUID(), 'tax_rate', '15'),
(UUID(), 'script_ga', ''),
(UUID(), 'script_meta_pixel', ''),
(UUID(), 'script_custom_head', '');
