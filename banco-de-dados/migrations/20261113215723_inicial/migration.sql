-- CreateTable
CREATE TABLE "Pesquisador" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "formacao" TEXT NOT NULL,
    "area" TEXT,
    "fotoUrl" TEXT,
    "lattesUrl" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "anoInicio" INTEGER,
    "imagemUrl" TEXT,
    "instagramUrl" TEXT,
    "pdfUrl" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "local" TEXT NOT NULL,
    "linkUrl" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Pesquisador_slug_key" ON "Pesquisador"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Projeto_slug_key" ON "Projeto"("slug");

-- CreateIndex
CREATE INDEX "Projeto_categoria_idx" ON "Projeto"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "Evento_slug_key" ON "Evento"("slug");

-- CreateIndex
CREATE INDEX "Evento_data_idx" ON "Evento"("data");
