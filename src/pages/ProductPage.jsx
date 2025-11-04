import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import Loading from "@/components/Loading";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { CartData } from "@/context/CartContext";
import { ProductData } from "@/context/ProductContext";
import { UserData } from "@/context/UserContext";
import { categories, server } from "@/main";

const ProductPage = () => {
  const { fetchProduct, product, relatedProduct, loading } = ProductData();
  const { addToCart } = CartData();
  const { id } = useParams();
  const { isAuth, user } = UserData();

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const addToCartHandler = () => addToCart(id);

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [updateImages, setUpdatedImages] = useState(null);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    fullScreen: false,
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      number: { value: 20 },
      color: { value: ["#a855f7", "#22d3ee", "#f472b6"] },
      opacity: { value: 0.3 },
      size: { value: { min: 1, max: 4 } },
      move: { enable: true, speed: 1, outModes: "out" },
    },
  };

  const updateHandler = () => {
    setShow(!show);
    setCategory(product.category);
    setTitle(product.title);
    setAbout(product.about);
    setStock(product.stock);
    setPrice(product.price);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/api/product/${id}`,
        { title, about, price, stock, category },
        { headers: { token: Cookies.get("token") } }
      );
      toast.success(data.message);
      fetchProduct(id);
      setShow(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleSubmitImage = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    if (!updateImages || updateImages.length === 0) {
      toast.error("Please select new images");
      setBtnLoading(false);
      return;
    }
    const formData = new FormData();
    for (let i = 0; i < updateImages.length; i++) {
      formData.append("files", updateImages[i]);
    }
    try {
      const { data } = await axios.post(`${server}/api/product/${id}`, formData, {
        headers: { token: Cookies.get("token") },
      });
      toast.success(data.message);
      fetchProduct(id);
    } catch (error) {
      toast.error(error.response?.data?.message || "Image update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="relative overflow-hidden">
      {/* Floating particles background */}
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="absolute inset-0 -z-10" />

      {product && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 py-12"
        >
          {/* Admin Panel */}
          {user && user.role === "admin" && (
            <motion.div layout className="w-[350px] md:w-[450px] mx-auto mb-8 p-4 bg-white/10 backdrop-blur-md rounded-xl shadow-xl">
              <Button onClick={updateHandler} variant="outline">
                {show ? <X /> : <Edit />}
              </Button>
              {show && (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 mt-4"
                  onSubmit={submitHandler}
                >
                  <Label>Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
                  <Label>About</Label>
                  <Input value={about} onChange={(e) => setAbout(e.target.value)} required />
                  <Label>Category</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-md dark:bg-gray-900 dark:text-white"
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <Label>Price</Label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                  <Label>Stock</Label>
                  <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
                  <Button type="submit" disabled={btnLoading}>
                    {btnLoading ? <Loader /> : "Update Product"}
                  </Button>
                </motion.form>
              )}
            </motion.div>
          )}

          {/* Product Display */}
          <div className="flex flex-col lg:flex-row items-start gap-16">
            {/* Carousel with 3D pop effect */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-[300px] md:w-[550px] relative"
            >
              <Carousel>
                <CarouselContent>
                  {product.images?.map((image, i) => (
                    <CarouselItem key={i}>
                      <motion.img
                        src={image.url}
                        alt="product"
                        className="w-full rounded-xl shadow-2xl object-contain hover:scale-105 transition-transform duration-500"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              {user?.role === "admin" && (
                <form onSubmit={handleSubmitImage} className="mt-4 space-y-3">
                  <Label>Upload New Images</Label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setUpdatedImages(e.target.files)}
                    className="block w-full text-sm"
                  />
                  <Button type="submit" disabled={btnLoading}>
                    Update Image
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-6"
            >
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-purple-600 bg-clip-text text-transparent">
                {product.title}
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">{product.about}</p>
              <p className="text-3xl font-semibold text-cyan-400">₹{product.price}</p>

              {isAuth ? (
                product.stock > 0 ? (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button onClick={addToCartHandler} className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-lg">
                      Add to Cart
                    </Button>
                  </motion.div>
                ) : (
                  <p className="text-red-500 text-2xl">Out of Stock</p>
                )
              ) : (
                <p className="text-blue-400">Please login to add something to the cart.</p>
              )}
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProduct?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mt-16">
              <h2 className="text-2xl font-bold mb-6">✨ Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProduct.map((e) => (
                  <ProductCard key={e._id} product={e} latest={e.latest} />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProductPage;
