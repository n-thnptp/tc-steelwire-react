-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2024 at 02:17 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tc_steelwire_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(5) NOT NULL,
  `action_type` enum('UPDATE_PROFILE','UPDATE_ADDRESS','UPDATE_ORDER_STATUS','ADMIN_UPDATE_ORDER','USER_LOGIN','USER_LOGOUT','PASSWORD_CHANGED','CREATE_ORDER','UPDATE_STOCK','UPDATE_PRICE','CREATE_SMO_ORDER','UPDATE_MATERIAL_ORDER_STATUS') NOT NULL,
  `description` text NOT NULL,
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `target_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `user_id`, `action_type`, `description`, `old_value`, `new_value`, `created_at`, `target_id`) VALUES
(3, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 220207, \"tambon_name\": \"ซึ้ง\", \"amphur_id\": 2202, \"amphur_name\": \"ขลุง\", \"province_id\": 13, \"province_name\": \"จันทบุรี\", \"zip_code\": 22110}', '{\"address\": \"lllllllll\", \"tambon_id\": 810402, \"tambon_name\": \"คลองท่อมเหนือ\", \"amphur_id\": 8104, \"amphur_name\": \"คลองท่อม\", \"province_id\": 64, \"province_name\": \"กระบี่\", \"zip_code\": 81120}', '2024-11-27 05:57:14', 1),
(4, 3, 'UPDATE_PROFILE', 'User updated their name', '{\"firstname\": \"Natthapat\", \"lastname\": \"ABCDEF\"}', '{\"firstname\": \"Natthapat\", \"lastname\": \"ABCDEFGHS\"}', '2024-11-27 05:58:11', 3),
(7, 31436, 'USER_LOGIN', 'User logged in', NULL, '{\"session_id\": \"1f661e98e64264fc9b40b6245162e556ed9f25a6\", \"email\": \"k@g.c\", \"login_time\": \"2024-11-27 13:02:07\", \"expiration\": \"2024-11-28 13:02:07\"}', '2024-11-27 06:02:07', 31436),
(8, 31436, 'USER_LOGOUT', 'User logged out', '{\"session_id\": \"1f661e98e64264fc9b40b6245162e556ed9f25a6\", \"email\": \"k@g.c\", \"login_time\": \"2024-11-27 13:02:07\", \"logout_time\": \"2024-11-27 13:02:21\"}', NULL, '2024-11-27 06:02:21', 31436),
(9, 3, 'USER_LOGIN', 'User logged in', NULL, '{\"session_id\": \"44669d61483d8f50ee1fb7d7f7b1894671d941c9\", \"email\": \"kicknametakeass118@gmail.com\", \"login_time\": \"2024-11-27 13:07:39\", \"expiration\": \"2024-11-28 13:07:39\"}', '2024-11-27 06:07:39', 3),
(10, 3, 'PASSWORD_CHANGED', 'User changed their password', '{\"email\": \"kicknametakeass118@gmail.com\", \"changed_at\": \"2024-11-27 13:09:59\", \"changed_from_ip\": null}', NULL, '2024-11-27 06:09:59', 3),
(11, 3, 'USER_LOGOUT', 'User logged out', '{\"session_id\": \"44669d61483d8f50ee1fb7d7f7b1894671d941c9\", \"email\": \"kicknametakeass118@gmail.com\", \"login_time\": \"2024-11-27 13:07:39\", \"logout_time\": \"2024-11-27 13:09:59\"}', NULL, '2024-11-27 06:09:59', 3),
(12, 3, 'USER_LOGIN', 'User logged in', NULL, '{\"session_id\": \"e3fee799561665417ada43c6f77558c40357c932\", \"email\": \"kicknametakeass118@gmail.com\", \"login_time\": \"2024-11-27 13:10:31\", \"expiration\": \"2024-11-28 13:10:31\"}', '2024-11-27 06:10:31', 3),
(13, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 810402, \"tambon_name\": \"คลองท่อมเหนือ\", \"amphur_id\": 8104, \"amphur_name\": \"คลองท่อม\", \"province_id\": 64, \"province_name\": \"กระบี่\", \"zip_code\": 81120}', '{\"address\": \"lllllllll\", \"tambon_id\": 711102, \"tambon_name\": \"กลอนโด\", \"amphur_id\": 7111, \"amphur_name\": \"ด่านมะขามเตี้ย\", \"province_id\": 56, \"province_name\": \"กาญจนบุรี\", \"zip_code\": 71260}', '2024-11-27 11:33:25', 1),
(14, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 711102, \"tambon_name\": \"กลอนโด\", \"amphur_id\": 7111, \"amphur_name\": \"ด่านมะขามเตี้ย\", \"province_id\": 56, \"province_name\": \"กาญจนบุรี\", \"zip_code\": 71260}', '{\"address\": \"lllllllll\", \"tambon_id\": 620407, \"tambon_name\": \"บ่อถ้ำ\", \"amphur_id\": 6204, \"amphur_name\": \"ขาณุวรลักษบุรี\", \"province_id\": 49, \"province_name\": \"กำแพงเพชร\", \"zip_code\": 62140}', '2024-11-27 11:39:27', 1),
(15, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 620407, \"tambon_name\": \"บ่อถ้ำ\", \"amphur_id\": 6204, \"amphur_name\": \"ขาณุวรลักษบุรี\", \"province_id\": 49, \"province_name\": \"กำแพงเพชร\", \"zip_code\": 62140}', '{\"address\": \"lllllllll\", \"tambon_id\": 101804, \"tambon_name\": \"คลองต้นไทร\", \"amphur_id\": 1018, \"amphur_name\": \"เขตคลองสาน\", \"province_id\": 1, \"province_name\": \"กรุงเทพมหานคร\", \"zip_code\": 10600}', '2024-11-27 11:53:00', 1),
(16, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 101804, \"tambon_name\": \"คลองต้นไทร\", \"amphur_id\": 1018, \"amphur_name\": \"เขตคลองสาน\", \"province_id\": 1, \"province_name\": \"กรุงเทพมหานคร\", \"zip_code\": 10600}', '{\"address\": \"lllllllll\", \"tambon_id\": 100202, \"tambon_name\": \"วชิรพยาบาล\", \"amphur_id\": 1002, \"amphur_name\": \"เขตดุสิต\", \"province_id\": 1, \"province_name\": \"กรุงเทพมหานคร\", \"zip_code\": 10300}', '2024-11-27 11:53:54', 1),
(17, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 100202, \"tambon_name\": \"วชิรพยาบาล\", \"amphur_id\": 1002, \"amphur_name\": \"เขตดุสิต\", \"province_id\": 1, \"province_name\": \"กรุงเทพมหานคร\", \"zip_code\": 10300}', '{\"address\": \"lllllllll\", \"tambon_id\": 700405, \"tambon_name\": \"ดอนกรวย\", \"amphur_id\": 7004, \"amphur_name\": \"ดำเนินสะดวก\", \"province_id\": 55, \"province_name\": \"ราชบุรี\", \"zip_code\": 70130}', '2024-11-27 11:55:14', 1),
(18, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 700405, \"tambon_name\": \"ดอนกรวย\", \"amphur_id\": 7004, \"amphur_name\": \"ดำเนินสะดวก\", \"province_id\": 55, \"province_name\": \"ราชบุรี\", \"zip_code\": 70130}', '{\"address\": \"lllllllll\", \"tambon_id\": 500207, \"tambon_name\": \"ดอยแก้ว\", \"amphur_id\": 5002, \"amphur_name\": \"จอมทอง\", \"province_id\": 38, \"province_name\": \"เชียงใหม่\", \"zip_code\": 50160}', '2024-11-27 11:56:15', 1),
(19, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 500207, \"tambon_name\": \"ดอยแก้ว\", \"amphur_id\": 5002, \"amphur_name\": \"จอมทอง\", \"province_id\": 38, \"province_name\": \"เชียงใหม่\", \"zip_code\": 50160}', '{\"address\": \"lllllllll\", \"tambon_id\": 101804, \"tambon_name\": \"คลองต้นไทร\", \"amphur_id\": 1018, \"amphur_name\": \"เขตคลองสาน\", \"province_id\": 1, \"province_name\": \"กรุงเทพมหานคร\", \"zip_code\": 10600}', '2024-11-27 11:56:53', 1),
(20, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 101804, \"tambon_name\": \"คลองต้นไทร\", \"amphur_id\": 1018, \"amphur_name\": \"เขตคลองสาน\", \"province_id\": 1, \"province_name\": \"กรุงเทพมหานคร\", \"zip_code\": 10600}', '{\"address\": \"lllllllll\", \"tambon_id\": 500204, \"tambon_name\": \"ข่วงเปา\", \"amphur_id\": 5002, \"amphur_name\": \"จอมทอง\", \"province_id\": 38, \"province_name\": \"เชียงใหม่\", \"zip_code\": 50160}', '2024-11-27 12:06:01', 1),
(21, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 500204, \"tambon_name\": \"ข่วงเปา\", \"amphur_id\": 5002, \"amphur_name\": \"จอมทอง\", \"province_id\": 38, \"province_name\": \"เชียงใหม่\", \"zip_code\": 50160}', '{\"address\": \"lllllllll\", \"tambon_id\": 101804, \"tambon_name\": \"คลองต้นไทร\", \"amphur_id\": 1018, \"amphur_name\": \"เขตคลองสาน\", \"province_id\": 1, \"province_name\": \"กรุงเทพมหานคร\", \"zip_code\": 10600}', '2024-11-27 12:33:15', 1),
(22, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 101804, \"tambon_name\": \"คลองต้นไทร\", \"amphur_id\": 1018, \"amphur_name\": \"เขตคลองสาน\", \"province_id\": 1, \"province_name\": \"กรุงเทพมหานคร\", \"zip_code\": 10600}', '{\"address\": \"lllllllll\", \"tambon_id\": 460512, \"tambon_name\": \"กุดค้าว\", \"amphur_id\": 4605, \"amphur_name\": \"กุฉินารายณ์\", \"province_id\": 34, \"province_name\": \"กาฬสินธุ์\", \"zip_code\": 46110}', '2024-11-27 12:34:31', 1),
(23, 3, 'UPDATE_ADDRESS', 'User updated shipping address', '{\"address\": \"lllllllll\", \"tambon_id\": 460512, \"tambon_name\": \"กุดค้าว\", \"amphur_id\": 4605, \"amphur_name\": \"กุฉินารายณ์\", \"province_id\": 34, \"province_name\": \"กาฬสินธุ์\", \"zip_code\": 46110}', '{\"address\": \"lllllllll\", \"tambon_id\": 101804, \"tambon_name\": \"คลองต้นไทร\", \"amphur_id\": 1018, \"amphur_name\": \"เขตคลองสาน\", \"province_id\": 1, \"province_name\": \"กรุงเทพมหานคร\", \"zip_code\": 10600}', '2024-11-27 12:37:09', 1),
(24, 3, 'CREATE_ORDER', 'New order created #101', NULL, 'Total: 21 THB', '2024-11-27 12:55:14', 101),
(25, 3, 'CREATE_ORDER', 'New order created #102', NULL, 'Total: 73 THB', '2024-11-27 12:57:18', 102),
(26, 3, 'UPDATE_STOCK', 'Stock updated for material #3', '40000', '39999', '2024-11-27 12:57:18', 3),
(27, 3, 'UPDATE_STOCK', 'Stock updated for material #2', '10555', '10553', '2024-11-27 12:57:18', 2),
(28, 3, 'USER_LOGOUT', 'User logged out', '{\"session_id\": \"e3fee799561665417ada43c6f77558c40357c932\", \"email\": \"kicknametakeass118@gmail.com\", \"login_time\": \"2024-11-27 13:10:31\", \"logout_time\": \"2024-11-27 19:57:54\"}', NULL, '2024-11-27 12:57:54', 3),
(29, 31436, 'USER_LOGIN', 'User logged in', NULL, '{\"session_id\": \"ab43c59418abc68662a7ac609ebae5f3fd5cd51c\", \"email\": \"k@g.c\", \"login_time\": \"2024-11-27 19:57:58\", \"expiration\": \"2024-11-28 19:57:58\"}', '2024-11-27 12:57:58', 31436),
(32, 31436, 'UPDATE_STOCK', 'Stock updated for WIRE size 3 mm', '3802 kg', '3803 kg', '2024-11-27 13:10:08', 1),
(33, 31436, 'CREATE_SMO_ORDER', 'New material order for size 3 mm', NULL, 'Quantity: 40000 kg', '2024-11-27 13:10:57', 8),
(34, 31436, 'UPDATE_MATERIAL_ORDER_STATUS', 'Material order status updated for WIRE size 3 mm', 'สั่งซื้อ', 'สั่งซื้อเสร็จสิ้น', '2024-11-27 13:13:59', 8),
(35, 31436, 'UPDATE_STOCK', 'Stock updated for WIRE size 3 mm', '3803 kg', '43803 kg', '2024-11-27 13:13:59', 1),
(36, 31436, 'USER_LOGOUT', 'User logged out', '{\"session_id\": \"ab43c59418abc68662a7ac609ebae5f3fd5cd51c\", \"email\": \"k@g.c\", \"login_time\": \"2024-11-27 19:57:58\", \"logout_time\": \"2024-11-27 20:14:25\"}', NULL, '2024-11-27 13:14:25', 31436);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`c_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
