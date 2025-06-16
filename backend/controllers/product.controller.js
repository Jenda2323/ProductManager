import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    console.log("Received product data:", req.body);
    console.log("User ID:", req.userId);

    const { name, image, cost, contact } = req.body;

    // Validate required fields
    if (!name || !image || !cost || !contact) {
      console.error("Missing required fields:", { name, image, cost, contact });
      return res.status(400).json({
        message: "Missing required fields",
        details: {
          name: !name ? "Product name is required" : null,
          image: !image ? "Image is required" : null,
          cost: !cost ? "Cost is required" : null,
          contact: !contact ? "Contact is required" : null,
        },
      });
    }

    // Validate cost is a positive number
    if (isNaN(cost) || cost <= 0) {
      console.error("Invalid cost:", cost);
      return res.status(400).json({
        message: "Invalid cost value",
        details: "Cost must be a positive number",
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      image,
      cost: Number(cost),
      contact,
      owner: req.userId,
    });

    console.log("Creating new product:", newProduct);

    const savedProduct = await newProduct.save();
    console.log("Product saved successfully:", savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Error creating product",
      details: error.message,
    });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Updating product:", id);
    console.log("Update data:", req.body);

    const product = await Product.findById(id);
    if (!product) {
      console.error("Product not found:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.owner.toString() !== req.userId) {
      console.error("Unauthorized update attempt:", {
        productOwner: product.owner,
        userId: req.userId,
      });
      return res.status(403).json({ message: "Forbidden" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("Product updated successfully:", updatedProduct);

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(400).json({
      message: "Error updating product",
      details: error.message,
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting product:", id);

    const product = await Product.findById(id);
    if (!product) {
      console.error("Product not found:", id);
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.owner.toString() !== req.userId) {
      console.error("Unauthorized delete attempt:", {
        productOwner: product.owner,
        userId: req.userId,
      });
      return res.status(403).json({ message: "Forbidden" });
    }

    await Product.findByIdAndDelete(id);
    console.log("Product deleted successfully:", id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      message: "Error deleting product",
      details: error.message,
    });
  }
};
