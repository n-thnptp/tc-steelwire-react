-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2024 at 01:40 PM
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
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `o_id` int(11) NOT NULL,
  `c_id` int(5) DEFAULT NULL,
  `o_date` date NOT NULL,
  `o_status_id` int(11) DEFAULT NULL,
  `subtotal` int(11) NOT NULL,
  `shipping_fee` int(10) NOT NULL,
  `o_total_price` float NOT NULL,
  `o_estimated_shipping_day` int(11) DEFAULT NULL,
  `courier_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`o_id`, `c_id`, `o_date`, `o_status_id`, `subtotal`, `shipping_fee`, `o_total_price`, `o_estimated_shipping_day`, `courier_id`) VALUES
(44, 3, '2024-11-14', 4, 86658, 3500, 90158, 3, 0),
(45, 3, '2024-11-14', 4, 86658, 3500, 90158, 3, 2),
(46, 3, '2024-11-14', 4, 26, 3500, 3526, 3, 1),
(83, 3, '2024-11-15', 4, 26, 3500, 3526, 3, 1),
(84, 3, '2024-11-15', 5, 26, 3500, 3526, 3, 0),
(85, 3, '2024-11-15', 5, 26, 3500, 3526, 3, 1),
(86, 3, '2024-11-15', 5, 26, 3500, 3526, 3, 0),
(87, 3, '2024-11-15', 5, 26, 3500, 3526, 3, 0),
(88, 3, '2024-11-15', 5, 26, 3500, 3526, 3, 0),
(89, 3, '2024-11-15', 4, 26, 3500, 3526, 3, 3),
(90, 3, '2024-11-15', 5, 26, 3500, 3526, 3, 0),
(91, 3, '2024-11-15', 5, 26, 3500, 3526, 3, 0),
(92, 3, '2024-11-15', 5, 26000, 3500, 29500, 3, 0),
(93, 3, '2024-11-15', 5, 26000, 3500, 29500, 3, 0),
(94, 3, '2024-11-15', 1, 15331, 0, 15331, 3, 0),
(95, 3, '2024-11-15', 5, 26, 3500, 3526, 3, 0),
(96, 3, '2024-11-15', 5, 26, 3500, 3526, 3, 0),
(97, 31436, '2024-11-15', 1, 78, 3500, 3578, 3, 0),
(98, 3, '2024-11-27', 1, 2762, 0, 2762, 3, 0),
(100, 3, '2024-11-27', 1, 72, 0, 72, 3, 0);

--
-- Triggers `order`
--
DELIMITER $$
CREATE TRIGGER `log_order_status_update` AFTER UPDATE ON `order` FOR EACH ROW BEGIN
    -- Get the role_id of the current user
    SET @user_role = (SELECT role_id FROM user WHERE c_id = @current_user_id);
    
    -- If order status has changed
    IF OLD.o_status_id != NEW.o_status_id THEN
        -- Get the status names for better logging
        SET @old_status = (SELECT name FROM order_status WHERE o_status_id = OLD.o_status_id);
        SET @new_status = (SELECT name FROM order_status WHERE o_status_id = NEW.o_status_id);
        
        -- If user is admin (role_id = 2)
        IF @user_role = 2 THEN
            INSERT INTO activity_logs (
                user_id,
                action_type,
                description,
                old_value,
                new_value,
                target_id
            )
            VALUES (
                @current_user_id,
                'ADMIN_UPDATE_ORDER',
                CONCAT('Admin updated order status for order #', NEW.o_id),
                @old_status,
                @new_status,
                NEW.o_id
            );
        ELSE
            -- Regular user update
            INSERT INTO activity_logs (
                user_id,
                action_type,
                description,
                old_value,
                new_value,
                target_id
            )
            VALUES (
                @current_user_id,
                'UPDATE_ORDER_STATUS',
                CONCAT('User updated order status for order #', NEW.o_id),
                @old_status,
                @new_status,
                NEW.o_id
            );
        END IF;
    END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`o_id`),
  ADD UNIQUE KEY `o_id` (`o_id`),
  ADD KEY `c_id` (`c_id`),
  ADD KEY `o_status_id` (`o_status_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `o_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`o_status_id`) REFERENCES `order_status` (`o_status_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
