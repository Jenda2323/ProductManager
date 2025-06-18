import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Chyba při načítání produktů:", error);
    res.status(500).json({ message: error.message });
  }
};

// Vytvoření nového produktu
export const createProduct = async (req, res) => {
  try {
    console.log("Přijatá data produktu:", req.body);
    console.log("ID uživatele:", req.userId);

    const { name, image, cost, contact } = req.body;

    // Validace povinných polí
    if (!name || !image || !cost || !contact) {
      console.error("Chybí povinná pole:", { name, image, cost, contact });
      return res.status(400).json({
        message: "Chybí povinná pole",
        details: {
          name: !name ? "Název produktu je povinný" : null,
          image: !image ? "Obrázek je povinný" : null,
          cost: !cost ? "Cena je povinná" : null,
          contact: !contact ? "Kontakt je povinný" : null,
        },
      });
    }

    // Validace, že cena je kladné číslo
    if (isNaN(cost) || cost <= 0) {
      console.error("Neplatná cena:", cost);
      return res.status(400).json({
        message: "Neplatná hodnota ceny",
        details: "Cena musí být kladné číslo",
      });
    }

    // Vytvoření nového produktu
    const newProduct = new Product({
      name,
      image,
      cost: Number(cost),
      contact,
      owner: req.userId,
    });

    console.log("Vytváření nového produktu:", newProduct);

    const savedProduct = await newProduct.save();
    console.log("Produkt úspěšně uložen:", savedProduct);

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Chyba při vytváření produktu:", error);
    res.status(500).json({
      message: "Chyba při vytváření produktu",
      details: error.message,
    });
  }
};

// Aktualizace produktu
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Aktualizace produktu:", id);
    console.log("Data pro aktualizaci:", req.body);

    const product = await Product.findById(id);
    if (!product) {
      console.error("Produkt nebyl nalezen:", id);
      return res.status(404).json({ message: "Produkt nebyl nalezen" });
    }

    if (product.owner.toString() !== req.userId) {
      console.error("Neoprávněný pokus o aktualizaci:", {
        productOwner: product.owner,
        userId: req.userId,
      });
      return res.status(403).json({ message: "Zakázáno" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("Produkt úspěšně aktualizován:", updatedProduct);

    res.json(updatedProduct);
  } catch (error) {
    console.error("Chyba při aktualizaci produktu:", error);
    res.status(400).json({
      message: "Chyba při aktualizaci produktu",
      details: error.message,
    });
  }
};

// Smazání produktu
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Mazání produktu:", id);

    const product = await Product.findById(id);
    if (!product) {
      console.error("Produkt nebyl nalezen:", id);
      return res.status(404).json({ message: "Produkt nebyl nalezen" });
    }

    if (product.owner.toString() !== req.userId) {
      console.error("Neoprávněný pokus o smazání:", {
        productOwner: product.owner,
        userId: req.userId,
      });
      return res.status(403).json({ message: "Zakázáno" });
    }

    await Product.findByIdAndDelete(id);
    console.log("Produkt úspěšně smazán:", id);

    res.json({ message: "Produkt byl úspěšně smazán" });
  } catch (error) {
    console.error("Chyba při mazání produktu:", error);
    res.status(500).json({
      message: "Chyba při mazání produktu",
      details: error.message,
    });
  }
};
