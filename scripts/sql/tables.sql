-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 27, 2024 at 02:40 PM
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
-- Table structure for table `shipping_address`
--

CREATE TABLE `shipping_address` (
  `sh_id` int(11) NOT NULL,
  `tambon_id` int(11) DEFAULT NULL,
  `address` varchar(100) NOT NULL,
  `amphur_id` int(11) DEFAULT NULL,
  `province_id` int(11) DEFAULT NULL,
  `zip_code` int(11) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `shipping_address`
--

INSERT INTO `shipping_address` (`sh_id`, `tambon_id`, `address`, `amphur_id`, `province_id`, `zip_code`, `latitude`, `longitude`) VALUES
(1, 101804, 'lllllllll', 1018, 1, 10600, 13.72340640, 100.50248857),
(14, 700401, '6-88 8', 7004, 55, 70130, 13.52802351, 99.96717749),
(17, 260301, '6-88 8', 2603, 17, 26110, 14.24770946, 101.02830793),
(11550, 630501, '6-88 8', 6305, 50, 63150, 17.46700498, 98.17677804),
(15610, 810402, '6-88 8', 8104, 64, 81120, 7.93036619, 99.26619265),
(16398, 180201, '6-88 8', 1802, 9, 17110, 15.31019356, 100.08178275),
(63649, 180201, '6-88 8', 1802, 9, 17110, 15.31019356, 100.08178275),
(70291, 260301, '6-88 8', 2603, 17, 26110, 14.24770946, 101.02830793),
(74053, 461201, '6-88 8', 4612, 34, 46220, 16.73114121, 103.33486138),
(82610, 711201, '6-88 8', 7112, 56, 71220, 14.68551411, 99.44009175);

--
-- Triggers `shipping_address`
--
DELIMITER $$
CREATE TRIGGER `log_shipping_address_update` AFTER UPDATE ON `shipping_address` FOR EACH ROW BEGIN
    -- Get the user_id who owns this shipping address
    SET @user_id = (SELECT c_id FROM user WHERE sh_id = NEW.sh_id LIMIT 1);
    
    -- Only log if something actually changed
    IF (OLD.address != NEW.address OR 
        OLD.tambon_id != NEW.tambon_id OR 
        OLD.amphur_id != NEW.amphur_id OR 
        OLD.province_id != NEW.province_id OR 
        OLD.zip_code != NEW.zip_code) AND 
        @user_id IS NOT NULL THEN
        
        -- Get location names for better logging
        SET @tambon_name = (SELECT name_th FROM tambons WHERE tambon_id = NEW.tambon_id);
        SET @amphur_name = (SELECT name_th FROM amphurs WHERE amphur_id = NEW.amphur_id);
        SET @province_name = (SELECT name_th FROM provinces WHERE province_id = NEW.province_id);
        
        INSERT INTO activity_logs (
            user_id,
            action_type,
            description,
            old_value,
            new_value,
            target_id
        )
        VALUES (
            @user_id,
            'UPDATE_ADDRESS',
            'User updated shipping address',
            JSON_OBJECT(
                'address', OLD.address,
                'tambon_id', OLD.tambon_id,
                'tambon_name', (SELECT name_th FROM tambons WHERE tambon_id = OLD.tambon_id),
                'amphur_id', OLD.amphur_id,
                'amphur_name', (SELECT name_th FROM amphurs WHERE amphur_id = OLD.amphur_id),
                'province_id', OLD.province_id,
                'province_name', (SELECT name_th FROM provinces WHERE province_id = OLD.province_id),
                'zip_code', OLD.zip_code
            ),
            JSON_OBJECT(
                'address', NEW.address,
                'tambon_id', NEW.tambon_id,
                'tambon_name', @tambon_name,
                'amphur_id', NEW.amphur_id,
                'amphur_name', @amphur_name,
                'province_id', NEW.province_id,
                'province_name', @province_name,
                'zip_code', NEW.zip_code
            ),
            NEW.sh_id
        );
    END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `shipping_address`
--
ALTER TABLE `shipping_address`
  ADD PRIMARY KEY (`sh_id`),
  ADD KEY `shipping_address_tambon_fk` (`tambon_id`),
  ADD KEY `shipping_address_amphur_fk` (`amphur_id`),
  ADD KEY `shipping_address_province_fk` (`province_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `shipping_address`
--
ALTER TABLE `shipping_address`
  MODIFY `sh_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82611;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `shipping_address`
--
ALTER TABLE `shipping_address`
  ADD CONSTRAINT `shipping_address_amphur_fk` FOREIGN KEY (`amphur_id`) REFERENCES `amphurs` (`amphur_id`),
  ADD CONSTRAINT `shipping_address_province_fk` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`province_id`),
  ADD CONSTRAINT `shipping_address_tambon_fk` FOREIGN KEY (`tambon_id`) REFERENCES `tambons` (`tambon_id`),
  ADD CONSTRAINT `tambon_address_ibfk1` FOREIGN KEY (`tambon_id`) REFERENCES `tambons` (`tambon_id`) ON DELETE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
