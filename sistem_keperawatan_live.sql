/*
SQLyog Enterprise v12.5.1 (64 bit)
MySQL - 5.7.41 : Database - sistem_keperawatan
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sistem_keperawatan` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `sistem_keperawatan`;

/*Table structure for table `kompetensi` */

DROP TABLE IF EXISTS `kompetensi`;

CREATE TABLE `kompetensi` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `kategori` varchar(100) NOT NULL,
  `uraian` text NOT NULL,
  `bobot` decimal(5,2) NOT NULL,
  `target_tahun` int(11) NOT NULL,
  `status` tinyint(4) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4;

/*Data for the table `kompetensi` */

insert  into `kompetensi`(`id`,`kategori`,`uraian`,`bobot`,`target_tahun`,`status`,`created_at`,`updated_at`) values 
(1,'A','Melakukan perawatan tali pusat',0.50,60,1,'2025-09-10 13:08:40','2025-09-10 13:08:40'),
(2,'B','Melakukan perawatan luka ',1.00,30,1,'2025-09-10 13:09:23','2025-09-10 13:09:23'),
(3,'A','Pengkajian pasien secara holistik (pengkajian dan diagnosa )',0.50,60,1,'2025-09-10 13:09:51','2025-09-10 13:09:51'),
(4,'A','Mempersiapkan kepulangan pasien',0.50,60,1,'2025-09-10 13:10:19','2025-09-10 13:10:19'),
(5,'B','Melakukan pemasangan infus',1.00,20,1,'2025-09-10 13:12:31','2025-09-10 13:12:31'),
(6,'A','Memandikan pasien dewasa / anak',0.50,60,1,'2025-09-10 13:13:02','2025-09-10 13:13:02'),
(7,'A','Memandikan pasien bayi',0.50,60,0,'2025-09-10 13:13:29','2025-09-10 13:15:40');

/*Table structure for table `logbook` */

DROP TABLE IF EXISTS `logbook`;

CREATE TABLE `logbook` (
  `logbook_id` int(11) NOT NULL AUTO_INCREMENT,
  `kode_pegawai` varchar(50) DEFAULT NULL,
  `bulan` int(2) NOT NULL,
  `tahun` year(4) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`logbook_id`),
  KEY `fk_logbook_pegawai` (`kode_pegawai`),
  CONSTRAINT `fk_logbook_pegawai` FOREIGN KEY (`kode_pegawai`) REFERENCES `pegawai` (`kode_pegawai`)
) ENGINE=InnoDB AUTO_INCREMENT=2025120002 DEFAULT CHARSET=utf8mb4;

/*Data for the table `logbook` */

/*Table structure for table `logbook_detail` */

DROP TABLE IF EXISTS `logbook_detail`;

CREATE TABLE `logbook_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `logbook_id` int(11) DEFAULT NULL,
  `kompetensi_id` int(11) DEFAULT NULL,
  `inisial_pasien` varchar(50) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `jumlah` int(11) DEFAULT '1',
  `spv` varchar(100) DEFAULT NULL,
  `nilai_skp` decimal(6,2) DEFAULT '0.00',
  `status_logbook` tinyint(1) DEFAULT '0',
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `logbook_id` (`logbook_id`),
  KEY `kompetensi_id` (`kompetensi_id`),
  CONSTRAINT `logbook_detail_ibfk_1` FOREIGN KEY (`logbook_id`) REFERENCES `logbook` (`logbook_id`),
  CONSTRAINT `logbook_detail_ibfk_2` FOREIGN KEY (`kompetensi_id`) REFERENCES `kompetensi` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4;

/*Data for the table `logbook_detail` */

/*Table structure for table `pegawai` */

DROP TABLE IF EXISTS `pegawai`;

CREATE TABLE `pegawai` (
  `kode_pegawai` varchar(50) NOT NULL,
  `nama_pegawai` varchar(100) NOT NULL,
  `unit_id` int(11) DEFAULT NULL,
  `divisi` varchar(100) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`kode_pegawai`),
  KEY `fk_pegawai_unit` (`unit_id`),
  CONSTRAINT `fk_pegawai_unit` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`unit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `pegawai` */

insert  into `pegawai`(`kode_pegawai`,`nama_pegawai`,`unit_id`,`divisi`,`status`,`created_at`,`updated_at`) values 
('107N','Ns. Ni Made Ayu Mirah Saraswati, S.Kep',104,'Keperawatan',1,'2025-10-01 09:16:27','2025-10-01 09:16:27'),
('93N','Ns. Ni Putu Yulia Dewi, S.Kep',102,'Keperawatan',1,'2025-09-13 10:55:44','2025-09-13 10:55:44'),
('A1047','I Komang Mahardika,S.Kom',111,'SIMRS-PT',1,'2025-09-10 22:28:45','2025-09-10 22:43:01'),
('A935','I Wayan Gunawan Suarna',111,'Keperawatan',0,'2025-10-01 14:22:40','2025-10-10 09:46:50'),
('D1178','Ni Komang Trinita Dewi, Amd.Keb',110,'Keperawatan',1,'2025-09-12 16:03:10','2025-09-12 16:03:10'),
('D737','Putu Teny Agustina Trijayanti, Amd.Keb',110,'Keperawatan',1,'2025-09-10 14:24:24','2025-09-13 11:22:34'),
('E1021','I Made Parwata, AMK',104,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E1026','Ns. Ni Made Meilan Suartini, S.Kep',102,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E1027','Ns. Sang Gede Nyoman Triadhi, S.kep',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E1029','Ida Bagus Gede Indra Manuaba, S.Kep.,Ns',103,'Keperawatan',0,'2025-09-18 11:04:23','2025-10-10 10:15:01'),
('E1037','Ns. Ida Ayu Gde Oka Barasutawati, S.Kep',104,'Keperawatan',1,'2025-09-10 13:25:33','2025-09-10 13:25:33'),
('E1084','Putu Eka Suryaningsih, A.Md.Kep',110,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E1087','I Made Geria, AMK',104,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E1089','Ni Luh Putu Rustini, Amd.Kep',107,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E113','Bdn. Ni Wayan Ariyanti, S.Tr.Keb.',110,'Keperawatan',1,'2025-09-10 14:23:50','2025-09-13 11:22:39'),
('E154','Ns. I Made Dwi Indrayana, S.Kep',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E155','Ns. Ni Putu Dian Lestari, S.Kep.',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E157','Ns. Ni Luh Putu Eka Yanthi, S.Kep.',110,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E158','Ns. I Made Budiana, S.Kep',108,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E160','Ni Made Sugiartini, Amd.Kep.',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E162','Ns. Ni Putu Yeni Aripin, S.Kep.',107,'Keperawatan',1,'2025-09-10 14:26:01','2025-09-13 11:23:03'),
('E316','Rahma Candra Saputra',101,'Keperawatan',0,'2025-09-09 22:44:05','2025-09-09 22:44:51'),
('E318','Ns. I Wayan Sudarta, S.Kep.',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E319','Ns. Ni Wayan Supari, S. Kep.',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E4101','Gusti Ayu Putu Rischa Cristiani, Amd.Kep',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E4103','Kadek Udi Prawita, Amd.Kep',110,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E440','Ns. I Ketut Sujana, S.Kep',104,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E442','Ns. Luh Putu Westyawati, S.Kep',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E464','Ns. I Made Agus Suwandika, S.Kep',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E465','Kadek Ari Suastini, Amd.Kep',107,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E468','Putu Riska Amelia, Amd.Kep',107,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E469','Ns. I Gede Suwantara, S.Kep.',104,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E535','Ns. Ni Luh Ariestini, S.Kep',108,'Keperawatan',1,'2025-09-10 14:25:14','2025-09-13 11:23:13'),
('E592','Kadek Dwi Cahyani, S.Kep., Ns',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E593','Ns. Ni Kadek Dwi Jayanti, S.Kep',106,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E594','Ns. Ni Luh Tetik Susanti,S.Kep',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E595','Dewa Gede Agung Istri Bulan Shintya Dewi, Amd.Kep',110,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E596','Dewa Ayu Made Candra Wati, Amd.Kep',106,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E598','Ns. Putu Adi Setyawan, S.Kep',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('E793','Putu Gede Abdi Darma Laksana,Amd.Kep',110,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N100','Luh Putu Sudiasih, A.md, Keb',102,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N101','Luh Mertasari A.md, Keb',102,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N102','Ni Kadek Yulia Puspita Dewi, A.md, Keb',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N103','Ni Nyoman Ariasih, A.md, Keb',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N104','Luh Putu Suartini, A.md, Keb',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N105','Ni Putu Purnami, A.Md, Keb',102,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N106','Dewa Ayu Putu Tisnawati, A.md, Keb',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N113','Ns. Ni Luh Putu Mega Kartika Candra, S.Kep',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N116','Ns. Ida Ayu Putu Gayatri Prabha, S.Tr.Kep.',108,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N132','Ida Ayu Putu Widiastuti, Amd.Kep',106,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N133','I Made Candra Dwi Kesuma, S.Kep., Ns.',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N138','Ns. Luh Ade Purnami, S.Kep',110,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N139','Kadek Yuliantini, Amd.Kep',110,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N140','I Gede Suka Adnyana, Amd.Kep',108,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N142','NI KADEK KATARINA AYU DAMAYANTI',108,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N143','Ns. NI MADE WINTARIASIH, S.Kep',110,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N158','I Nyoman Sudiana, S.Kep. Ners',104,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N159','Ns. Komang Edi Sanjaya, S.Kep',104,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N160','Made Pasek Swardika, Amd.Kep',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N161','Ns. Putu Agus Sasmita, S.Kep',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N162','Ns. Komang Suwari, S.Kep',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N164','Ns. I Gusti Ayu Putu Anggitha Puja Laksmi D., S.Kep',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N183','Ns. Made Redita, S.Kep',104,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N185','Komang Alit Saputra, S.Kep., Ns',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N186','Ns. A.A Sagung Putri Pradnya Paramitha, S.Kep',106,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N199','Ns. Ni Luh Sri Rahayu, S.Kep',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N236','Ns. Made Dwi Cahyadi, S.Kep',104,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N237','Ns. Kadek Yogi Sastrawan, S.Kep',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N238','Ns. Gede Made Suka Adnyana, S.Kep',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N243','Ns. Ni Made Rai Sri Widari S.Kep',102,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N244','Ns. I Kadek Yudi Pernanda S, Kep',108,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:06:42'),
('N245','Ns. Kadek Yudi Antara, S.Kep',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N246','Ns. Gede Edi Sastrawan, S.Kep',103,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N247','Ns. Kadek Suartama, S.Kep',101,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N254','Ns. Komang Srimartiasih Raharjani, S.Kep',102,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N3','Ns. Gusti Ayu Ida Sri Lestari, S.Kep',112,'Keperawatan',1,'2025-10-10 10:16:44','2025-10-10 10:16:44'),
('N94','Ns. Putu Yulita Anggi Pratiwi, S.Kep',102,'Keperawatan',1,'2025-09-18 11:04:23','2025-09-18 11:04:23'),
('N95','Ns.Ni Putu Ayu Padmaningsih,S.Kep',102,'Keperawatan',1,'2025-09-18 11:05:38','2025-09-18 11:05:38'),
('N98','Ns. Ni Made Lina Pertiwi, S.Kep',102,'Keperawatan',1,'2025-09-10 13:23:58','2025-09-10 13:23:58'),
('S42','I Gusti Ayu Made Sri Utami',105,'Keperawatan',1,'2025-10-10 09:43:28','2025-10-10 09:43:28'),
('test','test',123,'Keperawatan',0,'2025-10-01 14:19:42','2025-10-03 09:44:06'),
('test2','test',333,'Keperawatan',0,'2025-10-01 14:34:43','2025-10-01 15:47:45'),
('test3','testtest23',333,'Keperawatan',0,'2025-10-01 15:23:45','2025-10-01 15:42:24'),
('test4','test peg',111,'Keperawatan',0,'2025-10-03 10:08:40','2025-10-03 10:08:46');

/*Table structure for table `unit` */

DROP TABLE IF EXISTS `unit`;

CREATE TABLE `unit` (
  `unit_id` int(11) NOT NULL,
  `nama_unit` varchar(100) NOT NULL,
  `divisi` varchar(100) DEFAULT NULL,
  `kode_kaunit` varchar(50) DEFAULT NULL,
  `nama_kaunit` varchar(100) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`unit_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `unit` */

insert  into `unit`(`unit_id`,`nama_unit`,`divisi`,`kode_kaunit`,`nama_kaunit`,`status`,`created_at`,`updated_at`) values 
(100,'example','Keperawatan','B123','Ns. Ni Luh Kusma Dewi, S.Kep',0,'2025-09-09 22:10:15','2025-09-10 20:20:54'),
(101,'ICU','Keperawatan','E316','Rahma Candra Saputra, Amd.Kep.',1,'2025-09-09 21:36:25','2025-09-09 21:36:25'),
(102,'Rawat Inap 1','Keperawatan','E684','Ns. Ni Luh Kusma Dewi, S.Kep',1,'2025-09-09 21:37:45','2025-09-09 22:09:19'),
(103,'Rawat Inap 2','Keperawatan','E454','Ns. I Gusti Ayu Eka Nopiyanti, S.Kep',1,'2025-09-09 22:08:08','2025-09-09 22:08:08'),
(104,'Rawat Jalan','Keperawatan','E1037','Ns. Ida Ayu Gde Oka Barasutawati, S.Kep',1,'2025-09-09 22:26:52','2025-09-09 22:26:52'),
(105,'Komite Keperawatan','Keperawatan','D13','dr. IA Candra Puspita Dewi, M.Biomed',1,'2025-09-10 13:28:39','2025-10-01 14:11:31'),
(106,'Pelayanan Kamar Operasi dan CSSD','Keperawatan','E101','Pelayanan Kamar Operasi dan CSSD',1,'2025-09-10 14:12:03','2025-09-18 11:26:21'),
(107,'IVF','Keperawatan','E162','Ns. Ni Putu Yeni Aripin, S.Kep.',1,'2025-09-10 14:21:21','2025-09-10 14:21:21'),
(108,'UGD','Keperawatan','E535','Ns. Ni Luh Ariestini, S.Kep',1,'2025-09-10 14:22:08','2025-09-10 14:22:08'),
(110,'Kamar Bersalin','Keperawatan','E113','Bdn. Ni Wayan Ariyanti, S.Tr.Keb.',1,'2025-09-10 14:23:11','2025-09-10 14:23:11'),
(111,'SIMRS','SIMRS','A1047','I Komang Mahardika,S.Kom',1,'2025-09-10 22:33:22','2025-09-10 22:33:22'),
(112,'Manager Keperawatan','Keperawatan','D13','dr. IA Candra Puspita Dewi, M.Biomed',1,'2025-09-18 10:19:45','2025-09-18 11:30:23'),
(119,'Housekeping','Keperawatan','N243','Ns. Ni Made Rai Sri Widari S.Kep',0,'2025-10-01 14:09:18','2025-10-01 14:11:48'),
(123,'test 32','Keperawatan','test','test',0,'2025-10-03 09:43:12','2025-10-03 09:44:15'),
(333,'Unit Test 2','Test','107N','Ns. Ni Made Ayu Mirah Saraswati, S.Kep',0,'2025-10-01 14:04:40','2025-10-03 09:42:46');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `kode_pegawai` varchar(20) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `role` tinyint(1) NOT NULL DEFAULT '3',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_user_pegawai` (`kode_pegawai`),
  CONSTRAINT `fk_user_pegawai` FOREIGN KEY (`kode_pegawai`) REFERENCES `pegawai` (`kode_pegawai`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=279 DEFAULT CHARSET=utf8mb4;

/*Data for the table `user` */

insert  into `user`(`id`,`username`,`password`,`kode_pegawai`,`status`,`role`,`created_at`,`updated_at`) values 
(2,'admin','$2b$10$vB5OKmjacLmGG8LEDXskiu3dgHKHmfLqdfmb5gL06DFVfhkWTE26.','A1047',1,1,'2025-09-10 22:24:50','2025-09-13 16:21:52'),
(4,'113','$2b$10$hCkbN3TwVp.PnrwnGfNXLewW03U08OOzSgVY39CIUPdcH/vs38d12','E113',1,2,'2025-09-12 23:31:05','2025-10-07 09:18:17'),
(5,'737','$2b$10$xktJd8/vwntMcw2p5cnSQOvYbBuyaeY4YSwGPKg4gEnZGCGn3SBDC','D737',1,3,'2025-09-12 23:31:31','2025-09-12 23:31:31'),
(6,'1037','$2b$10$mSX5lCag0M86Q03hymICieQswBmT8veKxyhWxxkPx7VDCn0E2N/jy','E1037',1,2,'2025-09-13 16:14:05','2025-10-07 09:18:24'),
(205,'4101','$2b$10$ExwMdUs/qRIEt8qiuy9IR.cF/a1yyIk/UAkzF3u7.o1Z2gt5lJXYS','E4101',1,3,'2025-09-18 13:44:43','2025-10-15 10:07:35'),
(206,'155','$2b$10$V/dUozpxo6n8eugiHQssq.RR29jlGRnB0lAEKIc/qK3sJeCYluuzq','E155',1,3,'2025-09-18 13:44:43','2025-10-07 14:47:17'),
(207,'594','$2b$10$n0Axr6RBUwexM11oNxjwjezdwoBIl9hVH0Ik51Z1YX.y/vs4zT8MK','E594',1,3,'2025-09-18 13:44:43','2025-10-15 10:07:57'),
(208,'319','12345','E319',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:18'),
(209,'162','12345','N162',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:19'),
(210,'E160','12345','E160',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:19'),
(211,'164','12345','N164',0,3,'2025-09-18 13:44:43','2025-10-07 09:16:20'),
(212,'199','12345','N199',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:21'),
(213,'N113','12345','N113',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:21'),
(214,'442','12345','E442',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:22'),
(215,'592','12345','E592',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:25'),
(216,'133','$2b$10$VICa8cOs3vkm5ijdeCO4peVxv3/PuTbQvmzXW6IgZIbhduBpEDqKS','N133',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:26'),
(217,'237','12345','N237',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:26'),
(218,'247','12345','N247',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:27'),
(219,'160','12345','N160',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:27'),
(220,'185','12345','N185',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:27'),
(221,'793','12345','E793',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:28'),
(222,'4103','12345','E4103',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:28'),
(223,'595','12345','E595',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:29'),
(224,'143','12345','N143',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:29'),
(225,'157','12345','E157',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:30'),
(226,'139','12345','N139',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:30'),
(227,'138','12345','N138',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:31'),
(228,'1084','12345','E1084',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:31'),
(229,'238','12345','N238',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:31'),
(230,'245','12345','N245',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:32'),
(231,'246','12345','N246',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:32'),
(232,'161','12345','N161',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:33'),
(233,'598','12345','E598',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:33'),
(234,'154','12345','E154',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:34'),
(235,'1029','12345','E1029',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:34'),
(236,'318','12345','E318',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:35'),
(237,'1027','12345','E1027',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:36'),
(238,'464','12345','E464',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:36'),
(239,'596','12345','E596',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:37'),
(240,'593','12345','E593',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:38'),
(241,'132','12345','N132',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:38'),
(242,'186','12345','N186',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:39'),
(243,'105','12345','N105',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:39'),
(244,'100','12345','N100',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:40'),
(245,'102','12345','N102',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:42'),
(246,'106','12345','N106',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:43'),
(247,'103','12345','N103',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:43'),
(248,'104','12345','N104',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:44'),
(249,'465','12345','E465',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:57'),
(250,'1089','12345','E1089',1,3,'2025-09-18 13:44:43','2025-10-07 09:16:47'),
(251,'468','12345','E468',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:01'),
(252,'236','12345','N236',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:01'),
(253,'183','12345','N183',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:02'),
(254,'1021','12345','E1021',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:03'),
(255,'440','12345','E440',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:04'),
(256,'469','12345','E469',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:05'),
(257,'1087','12345','E1087',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:06'),
(258,'159','12345','N159',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:06'),
(259,'N158','12345','N158',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:07'),
(260,'140','12345','N140',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:08'),
(261,'158','12345','E158',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:08'),
(262,'244','12345','N244',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:09'),
(263,'116','12345','N116',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:10'),
(264,'142','12345','N142',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:11'),
(265,'101','12345','N101',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:12'),
(266,'94','12345','N94',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:13'),
(267,'254','12345','N254',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:13'),
(268,'243','12345','N243',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:15'),
(269,'1026','12345','E1026',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:16'),
(270,'95','12345','N95',1,3,'2025-09-18 13:44:43','2025-10-07 09:17:17'),
(274,'107','$2b$10$OxkwlwbeZXRZbiDo8kpgoOFEfMexbqdQxwypbScrmkp7XGXildzXC','107N',1,3,'2025-10-01 09:16:34','2025-10-07 09:17:18'),
(275,'gunsu','$2b$10$.hQ3KKtMWWwcieUT9U6vIeKv4wUWBg.NTl9KpZ2S0iHxLRNp80OXO','A935',1,1,'2025-10-03 09:53:35','2025-10-03 09:54:46'),
(276,'316','$2b$10$Y2Hhnhguq1r8Gx.SzAB/UugM4ZK4IEZQtrxe9YqrkjGmu701ajYvq','E316',1,2,'2025-10-07 09:23:53','2025-10-07 09:23:53'),
(277,'42','$2b$10$wO8xhJqP2X6g881fi5KK/.DYAgpkx9.2RfhjgdUi3K/vslZtVM8.6','S42',1,1,'2025-10-10 09:44:31','2025-10-10 09:44:31'),
(278,'N3','$2b$10$l2HkyfPsQbEZ56RdozEloOwFQQy58N4HSbk9k9lIRO29Ry8U9LBie','N3',1,1,'2025-10-10 10:17:17','2025-10-10 10:17:17');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
