import Loading from '@/components/Loading';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CartData } from '@/context/CartContext';
import { ProductData } from '@/context/ProductContext';
import { UserData } from '@/context/UserContext';
import { categories, server } from '@/main';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Edit, Loader, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { fetchProduct, product, relatedProduct, loading } = ProductData();
  const {addToCart} =CartData();
  
  const { id } = useParams();
  const { isAuth ,user} = UserData();

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const addToCartHandler =()=>{
    addToCart(id);
  };

  const[show,setShow] =useState(false)
  const [title,setTitle] =useState("");
  const [about,setAbout] =useState("");
  const [stock,setStock] =useState("");
  const[price,setPrice] =useState("");
  const [category,setCategory] =useState("");

  const [btnLoading,setBtnLoading] =useState(false)


  const updateHandler =()=>{
    setShow(!show)
    setCategory(product.category)
    setTitle(product.title);
    setAbout(product.about);
    setStock(product.stock);
    setPrice(product.price);
  };

  const submitHandler =async(e)=>{
    e.preventDefault()

    setBtnLoading(true)

    try {
      const {data} =await axios.put(`${server}/api/product/${id}`,{title,about,price,stock,category},{
        headers:{
          token:Cookies.get("token"),
        }
      });
      toast.success(data.message)
      fetchProduct(id)
      setShow(false)
      setBtnLoading(false);

    } catch (error) {
      toast.error(error.response.data.message)
      setBtnLoading(false)

    }
  }
   
   const [updateImages,setUpdatedImages] =useState(null)
   const handleSubmitImage =async(e)=>{
    e.preventDefault()
    setBtnLoading(true)

    if(!updateImages|| updateImages.length ===0){
      toast.error("Please select new length")
      setBtnLoading(false)
      return;
    }
    const formData =new FormData()

    for(let i=0;i<updateImages.length;i++){
      formData.append("files",updateImages[i]);
    }


    try {
      const {data} =await axios.post(`${server}/api/product/${id}`,formData,{
        headers:{
          token:Cookies.get("token"),
        }
      });
      toast.success(data.message)
      fetchProduct(id)
      setBtnLoading(false);

    } catch (error) {
      toast.error(error.response.data.message)
      setBtnLoading(false)

    }

   }

    
  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto px-4 py-8">

          {user && user.role ==="admin" && <div className='w-[350px] md:w-[450px] m-auto mb-5'>
             <Button onClick={updateHandler}>{show?<X/>:<Edit/>}</Button>
             {show && <div  className='space-y-4'>
              <div>
                <Label >Titlte</Label>
                <Input 
                placeholder="Product Title" 
                value={title} 
                onChange={(e)=>setTitle(e.target.value)}
                required
                />
              </div>

              <div>
                <Label >About</Label>
                <Input 
                placeholder="About Product" 
                value={about} 
                onChange={(e)=>setAbout(e.target.value)}
                required
                />
              </div>

              <div>
                <Label >Category</Label>
                <select 
                value={category}
                onChange={e=>setCategory(e.target.value)}
                required
                className='w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white'
                >
                  {
                    categories.map((e)=>(
                      <option value={e} key={e}>{e}</option>
                    ))
                  }

                </select>
              </div>

              <div>
                <Label >Price</Label>
                <Input 
                placeholder=" Product Price " 
                type="number"
                value={price} 
                onChange={(e)=>setPrice(e.target.value)}
                required
                />
              </div>

              <div>
                <Label >Stock</Label>
                <Input 
                placeholder="Product Stock"
                type="number" 
                value={stock} 
                onChange={(e)=>setStock(e.target.value)}
                required
                />
              </div>
                <Button 
                type="submit"
                 className="w-full" 
                 disabled={btnLoading}
                 onClick={submitHandler}

                 >
                  {
                    btnLoading?<Loader/>:"Update Product"
                  }
                </Button>
              </div>}
            </div>}
          {product && (
            <div className="flex flex-col lg:flex-row items-start gap-14">
              {/* Product Images Carousel */}
              <div className="w-[290px] md:w-[550px]">
                <Carousel>
                  <CarouselContent>
                    {product.images &&
                      product.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <img
                            src={image.url}
                            alt="image"
                            className="w-full rounded-md"
                          />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>

                {user && user.role ==="admin" && <form onSubmit={handleSubmitImage} className='flex flex-col gap-4'>

                  <div>
                    <Label>Upload New Images:</Label>
                    <input type="file" name='files' id='files' multiple accept='image/*'  onChange={e=>setUpdatedImages(e.target.files)}
                     className='block w-full mt-1 text-sm'
                    />
                   
                  </div>
                  <Button type="submit" disabled={btnLoading}>
                      Update Image
                    </Button>
                  </form>}
              </div>

              {/* Product Details */}
              <div className="w-full lg:w-1/2 space-y-4">
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <p className="text-lg">{product.about}</p>
                <p className="text-xl font-semibold">₹{product.price}</p>
                {isAuth ? (
                  <>
                    {product.stock > 0 ? (
                      <Button onClick={addToCartHandler}>Add to Cart</Button>
                    ) : (
                      <p className="text-red-600 text-2xl">Out of Stock</p>
                    )}
                  </>
                ) : (
                  <p className="text-blue-500">
                    Please login to add something to the cart.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Related Products Section */}
          {relatedProduct?.length > 0 && (
            <>
             {
              loading ? <Loading/>
              :
              <div className="mt-12">
              <h2 className="text-xl font-bold">Related Products</h2>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {relatedProduct.map((e) => (
                  <ProductCard key={e._id} product={e} />
                ))}
                
              </div>
            </div>
             }
            </>

          )}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
