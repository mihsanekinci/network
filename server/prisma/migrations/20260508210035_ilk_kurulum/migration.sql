-- CreateTable
CREATE TABLE "haritalar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baslik" TEXT NOT NULL,
    "aciklama" TEXT,
    "olusturulma_tarihi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenme_tarihi" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "dugumler" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "harita_id" TEXT NOT NULL,
    "etiket" TEXT NOT NULL,
    "tur" TEXT NOT NULL DEFAULT 'diger',
    "pozisyon_x" REAL NOT NULL,
    "pozisyon_y" REAL NOT NULL,
    "ozellikler" TEXT NOT NULL DEFAULT '{}',
    "olusturulma_tarihi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenme_tarihi" DATETIME NOT NULL,
    CONSTRAINT "dugumler_harita_id_fkey" FOREIGN KEY ("harita_id") REFERENCES "haritalar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "kenarlar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "harita_id" TEXT NOT NULL,
    "kaynak_id" TEXT NOT NULL,
    "hedef_id" TEXT NOT NULL,
    "etiket" TEXT,
    "yon" TEXT NOT NULL DEFAULT 'yonsuz',
    "olusturulma_tarihi" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellenme_tarihi" DATETIME NOT NULL,
    CONSTRAINT "kenarlar_harita_id_fkey" FOREIGN KEY ("harita_id") REFERENCES "haritalar" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "kenarlar_kaynak_id_fkey" FOREIGN KEY ("kaynak_id") REFERENCES "dugumler" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "kenarlar_hedef_id_fkey" FOREIGN KEY ("hedef_id") REFERENCES "dugumler" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
