import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1694436285476 implements MigrationInterface {
    name = 'Migration1694436285476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "authors" ("id" SERIAL NOT NULL, "litresId" numeric NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "fullName" character varying NOT NULL, "url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2a33786d2f6310e1ae9a0ad6eef" UNIQUE ("litresId"), CONSTRAINT "UQ_fae8fb30f04369a0c3e0130b8dc" UNIQUE ("url"), CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "books" ("id" SERIAL NOT NULL, "litresId" numeric NOT NULL, "title" character varying NOT NULL, "date" integer, "url" character varying, "pictures" character varying NOT NULL, "genreId" integer NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_83d679882e12dc56fb6275ef25d" UNIQUE ("litresId"), CONSTRAINT "UQ_3cd818eaf734a9d8814843f1197" UNIQUE ("title"), CONSTRAINT "UQ_02fc45358c718fb77c0d43ba006" UNIQUE ("url"), CONSTRAINT "UQ_38f0d72fa78379b45fe56a6b476" UNIQUE ("pictures"), CONSTRAINT "PK_f3f2f25a099d24e12545b70b022" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_books" ("id" SERIAL NOT NULL, "preference" boolean, "userId" integer, "bookId" integer, CONSTRAINT "PK_0be2dd81092c013a0a48104d5c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "userId" numeric NOT NULL, "chatId" numeric NOT NULL, "name" character varying, "inviteLink" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8bf09ba754322ab9c22a215c919" UNIQUE ("userId"), CONSTRAINT "UQ_096d474fe7c1af7be4726762505" UNIQUE ("chatId"), CONSTRAINT "UQ_f7504ca88bf8bf291d03da03d6a" UNIQUE ("inviteLink"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_genres" ("id" SERIAL NOT NULL, "preferenceLevel" integer NOT NULL DEFAULT '20', "userId" integer, "genreId" integer, CONSTRAINT "PK_61440878daed690f28ac7095d21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "genres" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "genreCod" character varying NOT NULL, CONSTRAINT "UQ_f105f8230a83b86a346427de94d" UNIQUE ("name"), CONSTRAINT "UQ_5bdd8ad05883a8db8bd70e062a2" UNIQUE ("genreCod"), CONSTRAINT "PK_80ecd718f0f00dde5d77a9be842" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "books_authors_authors" ("booksId" integer NOT NULL, "authorsId" integer NOT NULL, CONSTRAINT "PK_21cf65fb7b849bd3abd2c81cf4c" PRIMARY KEY ("booksId", "authorsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_25a2cff0aa5b6d28dfbfd1f40c" ON "books_authors_authors" ("booksId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5869907ade47c42570389388d2" ON "books_authors_authors" ("authorsId") `);
        await queryRunner.query(`CREATE TABLE "users_friends_users" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_d0b93e07874c78c16bdf28a24ca" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3b73d9dd6e964868c76294b77" ON "users_friends_users" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_6803c4075d7779e2e27d6b14c3" ON "users_friends_users" ("usersId_2") `);
        await queryRunner.query(`ALTER TABLE "users_books" ADD CONSTRAINT "FK_cc5b4ed413f38fc01ffbdb4d453" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_books" ADD CONSTRAINT "FK_a1af9463a83768194ffafdffc42" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_genres" ADD CONSTRAINT "FK_72cbb14e609e6b9ff40ec4efd4e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_genres" ADD CONSTRAINT "FK_4bc5b45a8501c4225668965cfb6" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "books_authors_authors" ADD CONSTRAINT "FK_25a2cff0aa5b6d28dfbfd1f40ca" FOREIGN KEY ("booksId") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "books_authors_authors" ADD CONSTRAINT "FK_5869907ade47c42570389388d25" FOREIGN KEY ("authorsId") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_friends_users" ADD CONSTRAINT "FK_a3b73d9dd6e964868c76294b77c" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_friends_users" ADD CONSTRAINT "FK_6803c4075d7779e2e27d6b14c34" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_friends_users" DROP CONSTRAINT "FK_6803c4075d7779e2e27d6b14c34"`);
        await queryRunner.query(`ALTER TABLE "users_friends_users" DROP CONSTRAINT "FK_a3b73d9dd6e964868c76294b77c"`);
        await queryRunner.query(`ALTER TABLE "books_authors_authors" DROP CONSTRAINT "FK_5869907ade47c42570389388d25"`);
        await queryRunner.query(`ALTER TABLE "books_authors_authors" DROP CONSTRAINT "FK_25a2cff0aa5b6d28dfbfd1f40ca"`);
        await queryRunner.query(`ALTER TABLE "users_genres" DROP CONSTRAINT "FK_4bc5b45a8501c4225668965cfb6"`);
        await queryRunner.query(`ALTER TABLE "users_genres" DROP CONSTRAINT "FK_72cbb14e609e6b9ff40ec4efd4e"`);
        await queryRunner.query(`ALTER TABLE "users_books" DROP CONSTRAINT "FK_a1af9463a83768194ffafdffc42"`);
        await queryRunner.query(`ALTER TABLE "users_books" DROP CONSTRAINT "FK_cc5b4ed413f38fc01ffbdb4d453"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6803c4075d7779e2e27d6b14c3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3b73d9dd6e964868c76294b77"`);
        await queryRunner.query(`DROP TABLE "users_friends_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5869907ade47c42570389388d2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_25a2cff0aa5b6d28dfbfd1f40c"`);
        await queryRunner.query(`DROP TABLE "books_authors_authors"`);
        await queryRunner.query(`DROP TABLE "genres"`);
        await queryRunner.query(`DROP TABLE "users_genres"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "users_books"`);
        await queryRunner.query(`DROP TABLE "books"`);
        await queryRunner.query(`DROP TABLE "authors"`);
    }

}
