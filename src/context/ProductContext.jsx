import { server } from '@/main';
import  {createContext, useContext, useEffect, useState} from 'react'
import axios from 'axios';
import { data } from 'react-router-dom';

const ProductContext =createContext()

export const ProductProvider =({children}) =>{

    const[products,setProducts] = useState([])
    const [loading,setLoading] =useState(false);
    const [newProd,setNewProd] =useState([]);
    const [page,setPage] =useState(1);
    const[totalPages,setTotalPages] =useState(1);
    const [search,setSearch] =useState("");
    const [category,setCategory] =useState("")
    const [price,setPrice] =useState("");
    const[categories,setCategories] =useState([])

    async function fetchProducts () {
        setLoading(true)
        try {
            const {data} =await axios.get(`${server}/api/product/all?search=${search}&category=${category}&sortByPrice=${price}&page=${page}`)

            setProducts(data.products)
            setNewProd(data.newProduct);
            setCategories(data.categories);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const [product,setProduct] = useState([])
    const [relatedProduct,setRelatedProduct] =useState([])

    async function fetchProduct (id) {
        setLoading(true);
        try {
            const {data} =await axios.get(`${server}/api/product/${id}`);
            setProduct(data.product);
            setRelatedProduct(data.relatedProduct);
            setLoading(false);
    
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchProducts();
    },[search,category,page,price]);

    return (
    <ProductContext.Provider value={{loading,products,newProd,search,setSearch,categories,category,setCategory,totalPages,price,setPrice,page,setPage,fetchProduct,product,relatedProduct,fetchProducts}}>
        {children}
    </ProductContext.Provider>
    )
}

export const ProductData = ()=> useContext(ProductContext);