import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, StarHalf, UserRound, Moon, SunMedium, Plus, LogIn, LogOut, Filter, ChevronDown, Search, Percent, Tag, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Utility: INR formatter
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

// Utility: price after discount
const priceAfter = (price, discount) => Math.round(price * (1 - (discount || 0) / 100));

// Star rating component
function Stars({ rating = 0 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const total = 5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} of 5`}>
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        if (idx <= full) return <Star key={i} className="w-4 h-4 fill-current" />;
        if (idx === full + 1 && half) return <StarHalf key={i} className="w-4 h-4 fill-current" />;
        return <Star key={i} className="w-4 h-4 opacity-30" />;
      })}
      <span className="text-xs ml-1 opacity-70">{rating.toFixed(1)}</span>
    </div>
  );
}

// Zebra Logo
function ZebraLogo({ size = 28 }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="relative" style={{ width: size, height: size }}>
        {/* stylized zebra head using simple stripes */}
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <pattern id="stripes" patternUnits="userSpaceOnUse" width="6" height="6">
              <rect width="6" height="6" />
              <path d="M0 0 L6 6 M-3 3 L3 9 M3 -3 L9 3" stroke="white" strokeWidth="2" />
            </pattern>
          </defs>
          <circle cx="32" cy="32" r="30" fill="url(#stripes)" />
          <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="38" cy="26" r="3" fill="currentColor" />
        </svg>
      </div>
      <span className="font-black text-2xl tracking-tight">Zebra</span>
    </div>
  );
}

// Seed products (20 items)
const seedProducts = [
  { id: 1, name: "Classic White Tee", category: "Men", price: 799, discount: 20, rating: 4.3, desc: "100% cotton, breathable everyday essential.", img: "https://picsum.photos/seed/z1/600/600" },
  { id: 2, name: "Slim Fit Jeans", category: "Men", price: 1999, discount: 30, rating: 4.6, desc: "Stretch denim with tapered legs.", img: "https://picsum.photos/seed/z2/600/600" },
  { id: 3, name: "Summer Floral Dress", category: "Women", price: 2499, discount: 25, rating: 4.7, desc: "Lightweight chiffon, midi length.", img: "https://picsum.photos/seed/z3/600/600" },
  { id: 4, name: "Athleisure Joggers", category: "Men", price: 1499, discount: 15, rating: 4.2, desc: "Moisture wicking fabric, zip pockets.", img: "https://picsum.photos/seed/z4/600/600" },
  { id: 5, name: "Oversized Hoodie", category: "Women", price: 1799, discount: 35, rating: 4.5, desc: "Fleece lined, cozy and warm.", img: "https://picsum.photos/seed/z5/600/600" },
  { id: 6, name: "Kids Unicorn Tee", category: "Kids", price: 699, discount: 10, rating: 4.4, desc: "Magical print, super soft.", img: "https://picsum.photos/seed/z6/600/600" },
  { id: 7, name: "Linen Shirt", category: "Men", price: 2199, discount: 20, rating: 4.1, desc: "Breathable linen for summer.", img: "https://picsum.photos/seed/z7/600/600" },
  { id: 8, name: "High-Waist Trousers", category: "Women", price: 2299, discount: 40, rating: 4.0, desc: "Tailored fit, office ready.", img: "https://picsum.photos/seed/z8/600/600" },
  { id: 9, name: "Denim Jacket", category: "Men", price: 2599, discount: 15, rating: 4.3, desc: "All-season staple layer.", img: "https://picsum.photos/seed/z9/600/600" },
  { id: 10, name: "Saree with Blouse", category: "Women", price: 3499, discount: 28, rating: 4.6, desc: "Georgette with delicate border.", img: "https://picsum.photos/seed/z10/600/600" },
  { id: 11, name: "Kids Track Set", category: "Kids", price: 1299, discount: 18, rating: 4.2, desc: "2-piece set for play days.", img: "https://picsum.photos/seed/z11/600/600" },
  { id: 12, name: "Printed Kurta", category: "Women", price: 1599, discount: 22, rating: 4.1, desc: "Cotton kurta, everyday wear.", img: "https://picsum.photos/seed/z12/600/600" },
  { id: 13, name: "Leather Belt", category: "Accessories", price: 999, discount: 10, rating: 4.5, desc: "Full-grain leather, metal buckle.", img: "https://picsum.photos/seed/z13/600/600" },
  { id: 14, name: "Canvas Sneakers", category: "Men", price: 1799, discount: 26, rating: 4.4, desc: "Cushioned footbed, lace-up.", img: "https://picsum.photos/seed/z14/600/600" },
  { id: 15, name: "Ankle Boots", category: "Women", price: 2899, discount: 30, rating: 4.3, desc: "Block heel, faux leather.", img: "https://picsum.photos/seed/z15/600/600" },
  { id: 16, name: "Baseball Cap", category: "Accessories", price: 599, discount: 5, rating: 4.0, desc: "Adjustable strap, curved brim.", img: "https://picsum.photos/seed/z16/600/600" },
  { id: 17, name: "Graphic Tee", category: "Men", price: 899, discount: 18, rating: 4.1, desc: "Bold print, relaxed fit.", img: "https://picsum.photos/seed/z17/600/600" },
  { id: 18, name: "Pleated Skirt", category: "Women", price: 1999, discount: 32, rating: 4.7, desc: "Knee length, swishy pleats.", img: "https://picsum.photos/seed/z18/600/600" },
  { id: 19, name: "Kids Raincoat", category: "Kids", price: 1399, discount: 20, rating: 4.2, desc: "Waterproof with hood.", img: "https://picsum.photos/seed/z19/600/600" },
  { id: 20, name: "Sling Bag", category: "Accessories", price: 1499, discount: 12, rating: 4.4, desc: "Compact crossbody with zip.", img: "https://picsum.photos/seed/z20/600/600" },
];

// Generate more sample products for Load More
const makeMore = (count, startId) => Array.from({ length: count }).map((_, i) => {
  const id = startId + i;
  const cats = ["Men", "Women", "Kids", "Accessories"];
  const cat = cats[id % cats.length];
  const base = 699 + (id % 7) * 300;
  const discount = [10, 15, 20, 25, 30, 35, 40][id % 7];
  return {
    id,
    name: `${cat} Style ${id}`,
    category: cat,
    price: base,
    discount,
    rating: 3.8 + ((id % 5) * 0.3),
    desc: `Trendy ${cat.toLowerCase()} piece number ${id}.`,
    img: `https://picsum.photos/seed/z${id}/600/600`
  };
});

export default function App() {
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState(seedProducts);
  const [cart, setCart] = useState([]); // {id, qty}
  const [authOpen, setAuthOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const categories = ["All", "Men", "Women", "Kids", "Accessories"];

  const filtered = useMemo(() => {
    let list = products.filter(p =>
      (category === "All" || p.category === category) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) || p.desc.toLowerCase().includes(query.toLowerCase()))
    );
    switch (sortBy) {
      case "priceLow":
        list.sort((a, b) => priceAfter(a.price, a.discount) - priceAfter(b.price, b.discount));
        break;
      case "priceHigh":
        list.sort((a, b) => priceAfter(b.price, b.discount) - priceAfter(a.price, a.discount));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        break;
    }
    return list;
  }, [products, query, category, sortBy]);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const cartItems = cart.map(c => ({ ...products.find(p => p.id === c.id), qty: c.qty }));
  const cartTotal = cartItems.reduce((s, it) => s + priceAfter(it.price, it.discount) * it.qty, 0);

  const addToCart = (id) => setCart(prev => {
    const exist = prev.find(x => x.id === id);
    if (exist) return prev.map(x => x.id === id ? { ...x, qty: x.qty + 1 } : x);
    return [...prev, { id, qty: 1 }];
  });

  const buyNow = (id) => {
    addToCart(id);
    // In a real app route to checkout. Here, we just open cart.
    const openSheet = document.getElementById("cart-trigger");
    if (openSheet) openSheet.click();
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(x => x.id !== id));
  const setQty = (id, qty) => setCart(prev => prev.map(x => x.id === id ? { ...x, qty: Math.max(1, qty) } : x));

  const onAddProduct = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nextId = Math.max(...products.map(p => p.id)) + 1;
    const p = {
      id: nextId,
      name: form.get("name"),
      category: form.get("category"),
      price: Number(form.get("price")),
      discount: Number(form.get("discount")) || 0,
      rating: Number(form.get("rating")) || 4.0,
      desc: form.get("desc"),
      img: form.get("img") || `https://picsum.photos/seed/z${nextId}/600/600`
    };
    setProducts(prev => [p, ...prev]);
    setAddOpen(false);
  };

  const loadMore = () => {
    const start = Math.max(...products.map(p => p.id)) + 1;
    setProducts(prev => [...prev, ...makeMore(12, start)]);
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-zinc-50 dark:bg-neutral-950 text-zinc-900 dark:text-zinc-100 transition-colors">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60 border-b border-zinc-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 gap-3">
              <div className="flex items-center gap-3">
                <ZebraLogo />
                <Badge className="rounded-2xl" variant="secondary"><span className="flex items-center gap-1"><Shirt className="w-4 h-4"/>Clothing</span></Badge>
              </div>

              {/* Search */}
              <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-6">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60"/>
                  <Input placeholder="Search for products… (e.g., hoodie, kurta)" value={query} onChange={e=>setQuery(e.target.value)} className="pl-9"/>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2"><Filter className="w-4 h-4"/>Filters</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Category</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    {categories.map(c => (
                      <DropdownMenuItem key={c} onClick={()=>setCategory(c)} className={category===c?"font-semibold":""}>{c}</DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator/>
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuItem onClick={()=>setSortBy("featured")}>Featured</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setSortBy("rating")}>Rating</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setSortBy("discount")}>Discount</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setSortBy("priceLow")}>Price: Low to High</DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setSortBy("priceHigh")}>Price: High to Low</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="gap-2" onClick={()=>setDark(d=>!d)}>
                  {dark ? <SunMedium className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
                  <span className="hidden sm:inline">{dark?"Light":"Dark"}</span>
                </Button>

                {/* Add Product */}
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2" variant="secondary"><Plus className="w-4 h-4"/>Add More</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add a Product</DialogTitle>
                      <DialogDescription>Quickly add a new product to your Zebra store.</DialogDescription>
                    </DialogHeader>
                    <form className="grid gap-4" onSubmit={onAddProduct}>
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label className="text-right">Name</Label>
                        <Input name="name" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label className="text-right">Category</Label>
                        <Select name="category" onValueChange={(v)=>{
                          const el = document.querySelector("input[name=category]");
                          if (el) el.value = v;
                        }}>
                          <SelectTrigger className="col-span-3"><SelectValue placeholder="Select"/></SelectTrigger>
                          <SelectContent>
                            {categories.filter(c=>c!=="All").map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        {/* hidden input to collect selected value in simple FormData */}
                        <input type="hidden" name="category" defaultValue="Men"/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label className="text-right">Price</Label>
                        <Input name="price" type="number" min="0" className="col-span-3" required/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label className="text-right">Discount %</Label>
                        <Input name="discount" type="number" min="0" max="90" className="col-span-3"/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label className="text-right">Rating</Label>
                        <Input name="rating" type="number" min="1" max="5" step="0.1" className="col-span-3"/>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-2">
                        <Label className="text-right">Image URL</Label>
                        <Input name="img" className="col-span-3" placeholder="https://…"/>
                      </div>
                      <div className="grid grid-cols-4 items-start gap-2">
                        <Label className="text-right mt-2">Description</Label>
                        <textarea name="desc" className="col-span-3 rounded-md border p-2 bg-transparent" rows={3} required />
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Product</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Auth */}
                <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2"><UserRound className="w-4 h-4"/>Login / Signup</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Welcome to Zebra</DialogTitle>
                      <DialogDescription>Login or create a new account to continue.</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="login" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign up</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login">
                        <form className="grid gap-3">
                          <Label>Email</Label>
                          <Input type="email" placeholder="you@example.com" required />
                          <Label>Password</Label>
                          <Input type="password" required />
                          <Button className="mt-2 gap-2"><LogIn className="w-4 h-4"/>Login</Button>
                        </form>
                      </TabsContent>
                      <TabsContent value="signup">
                        <form className="grid gap-3">
                          <Label>Full Name</Label>
                          <Input required />
                          <Label>Email</Label>
                          <Input type="email" required />
                          <Label>Password</Label>
                          <Input type="password" required />
                          <Button className="mt-2 gap-2"><UserRound className="w-4 h-4"/>Create Account</Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                {/* Cart */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button id="cart-trigger" variant="outline" className="gap-2"><ShoppingCart className="w-4 h-4"/>Cart {cartCount>0 && <Badge className="ml-1" variant="secondary">{cartCount}</Badge>}</Button>
                  </SheetTrigger>
                  <SheetContent className="flex flex-col">
                    <SheetHeader>
                      <SheetTitle>Your Cart</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto my-4 space-y-3 pr-2">
                      {cartItems.length === 0 && (
                        <p className="opacity-70">Your cart is empty. Add some stylish picks!</p>
                      )}
                      {cartItems.map(it => (
                        <div key={it.id} className="flex gap-3 items-center">
                          <img src={it.img} alt={it.name} className="w-16 h-16 rounded-lg object-cover"/>
                          <div className="flex-1">
                            <div className="font-medium line-clamp-1">{it.name}</div>
                            <div className="text-sm opacity-70">{inr.format(priceAfter(it.price, it.discount))} × {it.qty}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="outline" onClick={()=>setQty(it.id, Math.max(1, it.qty-1))}>-</Button>
                            <div className="px-2">{it.qty}</div>
                            <Button size="icon" variant="outline" onClick={()=>setQty(it.id, it.qty+1)}>+</Button>
                          </div>
                          <Button variant="ghost" onClick={()=>removeFromCart(it.id)}>Remove</Button>
                        </div>
                      ))}
                    </div>
                    <SheetFooter className="gap-2">
                      <div className="flex-1">
                        <div className="text-sm opacity-70">Subtotal</div>
                        <div className="text-xl font-bold">{inr.format(cartTotal)}</div>
                      </div>
                      <Button disabled={cartItems.length===0}>Checkout</Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Compact search controls for mobile */}
            <div className="md:hidden flex items-center gap-2 pb-3">
              <Input placeholder="Search products…" value={query} onChange={e=>setQuery(e.target.value)} />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Category"/></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Sort"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="priceLow">Price: Low to High</SelectItem>
                  <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="bg-gradient-to-b from-white to-zinc-100 dark:from-neutral-950 dark:to-neutral-900 border-b border-zinc-200/60 dark:border-neutral-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.4}} className="text-4xl md:text-5xl font-black tracking-tight">Style that Roars. <span className="opacity-80">Prices that Purr.</span></motion.h1>
                <p className="mt-3 opacity-80 max-w-xl">Flipkart/Amazon jaisa familiar interface, par Zebra ka sleek advanced theme. Trending outfits, smart filters, fast cart — sab ek jagah.</p>
                <div className="mt-5 flex gap-3">
                  <Button onClick={()=>document.getElementById("shop-section")?.scrollIntoView({behavior:'smooth'})}>Shop Now</Button>
                  <Button variant="outline" onClick={()=>setAuthOpen(true)} className="gap-2"><UserRound className="w-4 h-4"/>Login</Button>
                </div>
              </div>
              <div className="relative">
                <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-neutral-800">
                  <img src="https://picsum.photos/seed/zebra-hero/1200/700" alt="Zebra fashion banner" className="w-full h-[260px] md:h-[320px] object-cover"/>
                </motion.div>
                <div className="absolute -bottom-5 left-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur rounded-2xl px-4 py-2 shadow border border-zinc-200 dark:border-neutral-800 flex items-center gap-2">
                  <Percent className="w-4 h-4"/><span className="text-sm">Big festive discounts live now</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <main id="shop-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-2xl">{filtered.length} items</Badge>
              {category!=="All" && <Badge className="rounded-2xl" variant="secondary">{category}</Badge>}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[160px]"><Tag className="w-4 h-4 mr-2"/><SelectValue placeholder="Category"/></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]"><ChevronDown className="w-4 h-4 mr-2"/><SelectValue placeholder="Sort by"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="discount">Best Discount</SelectItem>
                  <SelectItem value="priceLow">Price: Low to High</SelectItem>
                  <SelectItem value="priceHigh">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {filtered.map(p => (
                <motion.div layout key={p.id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0}}>
                  <Card className="overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-shadow h-full flex flex-col">
                    <CardHeader className="p-0">
                      <div className="relative">
                        <img src={p.img} alt={p.name} className="w-full h-56 object-cover"/>
                        {p.discount>0 && (
                          <Badge className="absolute top-3 left-3 bg-emerald-600 text-white hover:bg-emerald-600/90">
                            {p.discount}% OFF
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-semibold line-clamp-1">{p.name}</div>
                        <Badge variant="outline" className="rounded-xl text-xs">{p.category}</Badge>
                      </div>
                      <div className="mt-1"><Stars rating={p.rating}/></div>
                      <p className="text-sm opacity-80 mt-2 line-clamp-2">{p.desc}</p>
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold">{inr.format(priceAfter(p.price, p.discount))}</div>
                          <div className="text-xs opacity-60 line-through">{inr.format(p.price)}</div>
                        </div>
                        <div className="text-right text-xs opacity-70">Inclusive of all taxes</div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={()=>addToCart(p.id)}>Add to Cart</Button>
                      <Button onClick={()=>buyNow(p.id)}>Buy Now</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="secondary" onClick={loadMore}>Load more</Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-neutral-800 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 opacity-80"><ZebraLogo size={22}/><span className="text-sm">© {new Date().getFullYear()} Zebra Clothing</span></div>
            <div className="text-sm opacity-80">Made with ❤ — Flipkart/Amazon inspired UI, Zebra advanced theme.</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
