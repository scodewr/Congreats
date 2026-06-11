CREATE TABLE categories (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE category_suggested_skills (
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    skill VARCHAR(255) NOT NULL,
    PRIMARY KEY (category_id, skill)
);

INSERT INTO categories (id, name, description, active) VALUES
    ('a1b2c3d4-0001-0001-0001-000000000001', 'Engenharia de Software', 'Habilidades técnicas de desenvolvimento e arquitetura de software', TRUE),
    ('a1b2c3d4-0002-0002-0002-000000000002', 'Liderança', 'Capacidades de liderança, gestão de equipes e tomada de decisão', TRUE),
    ('a1b2c3d4-0003-0003-0003-000000000003', 'Comunicação', 'Habilidades de comunicação, apresentação e facilitação', TRUE),
    ('a1b2c3d4-0004-0004-0004-000000000004', 'Inovação', 'Criatividade, resolução de problemas e pensamento inovador', TRUE),
    ('a1b2c3d4-0005-0005-0005-000000000005', 'Colaboração', 'Trabalho em equipe, cooperação e suporte entre pares', TRUE),
    ('a1b2c3d4-0006-0006-0006-000000000006', 'Gestão de Produto', 'Visão de produto, priorização e entrega de valor', TRUE),
    ('a1b2c3d4-0007-0007-0007-000000000007', 'Dados e Análise', 'Análise de dados, inteligência de negócios e modelagem', TRUE),
    ('a1b2c3d4-0008-0008-0008-000000000008', 'DevOps e Infraestrutura', 'Operações, automação, cloud e confiabilidade', TRUE);

INSERT INTO category_suggested_skills (category_id, skill) VALUES
    ('a1b2c3d4-0001-0001-0001-000000000001', 'Java'),
    ('a1b2c3d4-0001-0001-0001-000000000001', 'Clean Code'),
    ('a1b2c3d4-0001-0001-0001-000000000001', 'Design Patterns'),
    ('a1b2c3d4-0001-0001-0001-000000000001', 'Arquitetura de Software'),
    ('a1b2c3d4-0001-0001-0001-000000000001', 'TDD'),
    ('a1b2c3d4-0002-0002-0002-000000000002', 'Gestão de Equipes'),
    ('a1b2c3d4-0002-0002-0002-000000000002', 'Mentoring'),
    ('a1b2c3d4-0002-0002-0002-000000000002', 'Tomada de Decisão'),
    ('a1b2c3d4-0002-0002-0002-000000000002', 'Planejamento Estratégico'),
    ('a1b2c3d4-0003-0003-0003-000000000003', 'Apresentações'),
    ('a1b2c3d4-0003-0003-0003-000000000003', 'Documentação'),
    ('a1b2c3d4-0003-0003-0003-000000000003', 'Facilitação'),
    ('a1b2c3d4-0004-0004-0004-000000000004', 'Design Thinking'),
    ('a1b2c3d4-0004-0004-0004-000000000004', 'Resolução de Problemas'),
    ('a1b2c3d4-0004-0004-0004-000000000004', 'Prototipagem'),
    ('a1b2c3d4-0005-0005-0005-000000000005', 'Trabalho em Equipe'),
    ('a1b2c3d4-0005-0005-0005-000000000005', 'Suporte entre Pares'),
    ('a1b2c3d4-0005-0005-0005-000000000005', 'Empatia'),
    ('a1b2c3d4-0006-0006-0006-000000000006', 'Product Discovery'),
    ('a1b2c3d4-0006-0006-0006-000000000006', 'Roadmap'),
    ('a1b2c3d4-0006-0006-0006-000000000006', 'Métricas de Produto'),
    ('a1b2c3d4-0007-0007-0007-000000000007', 'SQL'),
    ('a1b2c3d4-0007-0007-0007-000000000007', 'Análise de Dados'),
    ('a1b2c3d4-0007-0007-0007-000000000007', 'Machine Learning'),
    ('a1b2c3d4-0008-0008-0008-000000000008', 'Docker'),
    ('a1b2c3d4-0008-0008-0008-000000000008', 'Kubernetes'),
    ('a1b2c3d4-0008-0008-0008-000000000008', 'CI/CD'),
    ('a1b2c3d4-0008-0008-0008-000000000008', 'Cloud AWS');
