import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProductPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, "products", id); // products — назва колекції!
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProduct(docSnap.data());
            } else {
                console.log("Товар не знайдено!");
            }
        };
        fetchProduct();
    }, [id]);

    return (
        <div>
            {product ? (
                <div className="product">
                    <img src={product.image} alt={product.name} />
                    <h1>{product.name}</h1>
                    <p>Ціна: {product.price} грн</p>
                </div>
            ) : (
                <p>Завантаження...</p>
            )}
        </div>
    );
};

export default ProductPage;