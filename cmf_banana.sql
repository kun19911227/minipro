/*
MySQL Data Transfer
Source Host: 47.101.142.17
Source Database: zxwenyi
Target Host: 47.101.142.17
Target Database: zxwenyi
Date: 2019/4/24 12:39:16
*/

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for cmf_banana
-- ----------------------------
DROP TABLE IF EXISTS `cmf_banana`;
CREATE TABLE `cmf_banana` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '上传图片测试表id',
  `name` varchar(30) NOT NULL COMMENT '姓名',
  `phone` varchar(15) NOT NULL COMMENT '手机号',
  `introduce` varchar(200) NOT NULL COMMENT '个人简介',
  `photo` text COMMENT '图片地址',
  `create_time` int(10) NOT NULL COMMENT '创建日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records 
-- ----------------------------
