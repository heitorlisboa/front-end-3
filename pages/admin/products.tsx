import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import { Modal } from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import type { GetServerSideProps, NextPage } from "next";
import type { Product } from "@prisma/client";

import styles from "@page-styles/admin/Products.module.scss";

import Container from "@components/Container";
import Button from "@components/Button";
import TrashSvg from "@icons/TrashSvg";
import PencilSvg from "@icons/PencilSvg";
import { formatPrice, getBaseUrl } from "@src/utils";
import BrandLink from "@src/components/BrandLink";

type ManageProductsProps = {
  products: Product[];
  baseUrl: string;
};

const ManageProducts: NextPage<ManageProductsProps> =
  function ManageProductsPage({ products: initialProducts, baseUrl }) {
    const pageTitleId = "admin-all-products-title";

    const [products, setProducts] = useState(initialProducts);
    const [modalOpened, setModalOpened] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState<string>("");

    function handleOpenModal(productId: string) {
      setModalOpened(true);
      setProductIdToDelete(productId);
    }

    function handleCloseModal() {
      setModalOpened(false);
      setProductIdToDelete("");
    }

    function handleDelete() {
      showNotification({
        id: "delete-product",
        message: "Deletando produto, espere um momento...",
        loading: true,
        autoClose: false,
        disallowClose: true,
      });

      axios
        .delete(`${baseUrl}/api/product/${productIdToDelete}`)
        .then(({ data: deletedProduct }: { data: Product }) => {
          // Removing the product from the `products` state
          setProducts((prevState) =>
            prevState.filter((product) => product.id !== deletedProduct.id)
          );

          // Success notification
          updateNotification({
            id: "delete-product",
            color: "green",
            message: "Produto deletado com sucesso!",
          });
        })
        .catch((err) => {
          // Error notification
          updateNotification({
            id: "delete-product",
            color: "red",
            title: "Erro ao deletar produto",
            message: err,
          });
        });

      // Closing the modal after confirming the action
      handleCloseModal();
    }

    return (
      <>
        <Head>
          <title>Admin - Todos os produtos</title>
        </Head>

        <main id="main-content">
          <Container className={styles.container}>
            <Modal
              title={"Tem certeza que quer excluir esse produto?"}
              opened={modalOpened}
              onClose={handleCloseModal}
              closeButtonLabel={"Cancelar de deleção de produto"}
              styles={{ title: { fontFamily: "inherit" } }}
            >
              <Button onClick={handleDelete}>Confirmar</Button>
            </Modal>

            <header className={styles.header}>
              <h2 id={pageTitleId} className={styles.title}>
                Todos os produtos
              </h2>
              <Button as="link" linkHref="/admin/product/new">
                Adicionar produto
              </Button>
            </header>
            <ul className={styles.productList} aria-labelledby={pageTitleId}>
              {products.map((product) => (
                <li className={styles.product} key={product.id}>
                  <Image
                    src={product.imageUrl}
                    alt={`Foto de ${product.name}`}
                    width={100}
                    height={100}
                    objectFit="cover"
                    layout="responsive"
                  />

                  <div className={styles.productIcons}>
                    <button onClick={handleOpenModal.bind(null, product.id)}>
                      <TrashSvg />
                    </button>
                    <Link href={`/admin/product/${product.id}`}>
                      <a>
                        <PencilSvg />
                      </a>
                    </Link>
                  </div>

                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <p>
                    <strong>{formatPrice(product.price)}</strong>
                  </p>
                  <p className={styles.productId}>{product.id}</p>
                  <p>
                    <BrandLink href={`/product/${product.id}`}>
                      Ver produto
                    </BrandLink>
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </main>
      </>
    );
  };

export const getServerSideProps: GetServerSideProps = async (context) => {
  const baseUrl = getBaseUrl(context.req.headers);

  const { data: products } = await axios.get(`${baseUrl}/api/products`);

  return {
    props: {
      products,
      baseUrl,
    },
  };
};

export default ManageProducts;
