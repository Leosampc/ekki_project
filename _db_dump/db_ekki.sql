-- phpMyAdmin SQL Dump
-- version 4.4.15.7
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Tempo de geração: 15/07/2019 às 17:22
-- Versão do servidor: 5.6.37
-- Versão do PHP: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `db_ekki`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `conta`
--

CREATE TABLE IF NOT EXISTS `conta` (
  `id` int(11) NOT NULL,
  `saldo` double(8,2) NOT NULL,
  `limite` double(8,2) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Fazendo dump de dados para tabela `conta`
--

INSERT INTO `conta` (`id`, `saldo`, `limite`, `usuario_id`, `data_cadastro`, `data_atualizacao`) VALUES
(1, 500.00, 500.00, 1, '2019-07-15 14:17:03', '2019-07-15 14:21:29'),
(2, 1100.00, 500.00, 2, '2019-07-15 14:17:40', '2019-07-15 14:21:12'),
(3, 1900.00, 500.00, 3, '2019-07-15 14:17:40', '2019-07-15 14:21:54'),
(7, 1000.00, 500.00, 1, '2019-07-15 14:18:06', '2019-07-15 14:21:54');

-- --------------------------------------------------------

--
-- Estrutura para tabela `favorecido`
--

CREATE TABLE IF NOT EXISTS `favorecido` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `usuario_conta_id` int(11) NOT NULL,
  `favorecido_id` int(11) NOT NULL,
  `favorecido_conta_id` int(11) NOT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Fazendo dump de dados para tabela `favorecido`
--

INSERT INTO `favorecido` (`id`, `usuario_id`, `usuario_conta_id`, `favorecido_id`, `favorecido_conta_id`, `data_cadastro`) VALUES
(1, 1, 1, 2, 2, '2019-07-15 14:20:08'),
(2, 1, 1, 3, 3, '2019-07-15 14:20:27'),
(3, 1, 7, 3, 3, '2019-07-15 14:20:52');

-- --------------------------------------------------------

--
-- Estrutura para tabela `transferencia`
--

CREATE TABLE IF NOT EXISTS `transferencia` (
  `id` int(11) NOT NULL,
  `descricao` varchar(100) DEFAULT NULL,
  `valor` double(8,2) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `usuario_conta_id` int(11) NOT NULL,
  `favorecido_id` int(11) NOT NULL,
  `favorecido_conta_id` int(11) NOT NULL,
  `status` varchar(10) NOT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Fazendo dump de dados para tabela `transferencia`
--

INSERT INTO `transferencia` (`id`, `descricao`, `valor`, `usuario_id`, `usuario_conta_id`, `favorecido_id`, `favorecido_conta_id`, `status`, `data_cadastro`, `data_atualizacao`) VALUES
(1, 'Primeira Transacao', 100.00, 1, 1, 2, 2, 'APROVADO', '2019-07-15 14:21:12', '2019-07-15 14:21:12'),
(2, 'Segunda Transacao', 400.00, 1, 1, 3, 3, 'APROVADO', '2019-07-15 14:21:29', '2019-07-15 14:21:29'),
(3, 'Terceira Transacao', 500.00, 1, 7, 3, 3, 'APROVADO', '2019-07-15 14:21:54', '2019-07-15 14:21:54');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `telefone` varchar(11) DEFAULT NULL,
  `data_cadastro` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `data_atualizacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Fazendo dump de dados para tabela `usuario`
--

INSERT INTO `usuario` (`id`, `nome`, `cpf`, `telefone`, `data_cadastro`, `data_atualizacao`) VALUES
(1, 'Leonardo Sampaio da Cruz', '12345678978', '51999558844', '2019-07-15 14:15:42', '2019-07-15 14:16:33'),
(2, 'Usuario 2', '32165498774', '54987654121', '2019-07-15 14:15:42', '2019-07-15 14:16:36'),
(3, 'Fulano da Silva', '85274196398', '51998774587', '2019-07-15 14:16:29', '2019-07-15 14:16:38');

--
-- Índices de tabelas apagadas
--

--
-- Índices de tabela `conta`
--
ALTER TABLE `conta`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conta_usuario_id` (`usuario_id`);

--
-- Índices de tabela `favorecido`
--
ALTER TABLE `favorecido`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_favorecido_id` (`usuario_id`),
  ADD KEY `favorecido_conta_id` (`favorecido_conta_id`),
  ADD KEY `usuario_conta_id` (`usuario_conta_id`),
  ADD KEY `favorecido_usuario_id` (`favorecido_id`);

--
-- Índices de tabela `transferencia`
--
ALTER TABLE `transferencia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transferencia_usuario_id` (`usuario_id`),
  ADD KEY `transferencia_favorecido_id` (`favorecido_id`),
  ADD KEY `transferencia_favorecido_conta_id` (`favorecido_conta_id`),
  ADD KEY `usuario_conta_id` (`usuario_conta_id`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas apagadas
--

--
-- AUTO_INCREMENT de tabela `conta`
--
ALTER TABLE `conta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT de tabela `favorecido`
--
ALTER TABLE `favorecido`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de tabela `transferencia`
--
ALTER TABLE `transferencia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
--
-- Restrições para dumps de tabelas
--

--
-- Restrições para tabelas `conta`
--
ALTER TABLE `conta`
  ADD CONSTRAINT `conta_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Restrições para tabelas `favorecido`
--
ALTER TABLE `favorecido`
  ADD CONSTRAINT `favorecido_conta_id` FOREIGN KEY (`favorecido_conta_id`) REFERENCES `conta` (`id`),
  ADD CONSTRAINT `favorecido_usuario_id` FOREIGN KEY (`favorecido_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `usuario_conta_id` FOREIGN KEY (`usuario_conta_id`) REFERENCES `conta` (`id`),
  ADD CONSTRAINT `usuario_favorecido_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

--
-- Restrições para tabelas `transferencia`
--
ALTER TABLE `transferencia`
  ADD CONSTRAINT `transferencia_favorecido_conta_id` FOREIGN KEY (`favorecido_conta_id`) REFERENCES `conta` (`id`),
  ADD CONSTRAINT `transferencia_favorecido_id` FOREIGN KEY (`favorecido_id`) REFERENCES `usuario` (`id`),
  ADD CONSTRAINT `transferencia_usuario_conta_id` FOREIGN KEY (`usuario_conta_id`) REFERENCES `conta` (`id`),
  ADD CONSTRAINT `transferencia_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
