import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const OffresCoachingContext = createContext();

export const useOffresCoaching = () => {
  const context = useContext(OffresCoachingContext);
  if (!context) {
    throw new Error("useOffresCoaching must be used within an OffresCoachingProvider");
  }
  return context;
};

export const OffresCoachingProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate getting the token (in practice, this might come from auth context or local storage)
  const token = localStorage.getItem("token") || "your-auth-token"; // Replace with real token handling

  // Create a custom axios instance to include the Authorization header
  const createAxiosInstance = (token) => {
    return axios.create({
      baseURL: "https://msxghost.boardy.fr/api",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };
  // Create Axios instance with the token
  const axiosInstance = createAxiosInstance(token);

  const fetchData = async () => {
    console.log("OffresCoachingProvider: Début du chargement des données");
    try {
      setLoading(true);

      // Récupérer les catégories
      console.log("OffresCoachingProvider: Appel API pour les catégories");
      const categoriesResponse = await axiosInstance.get("/categories");
      console.log("OffresCoachingProvider: Catégories reçues", categoriesResponse.data);
      setCategories(categoriesResponse.data);

      // Récupérer les offres
      console.log("OffresCoachingProvider: Appel API pour les offres");
      const offresResponse = await axiosInstance.get("/offres");
      console.log("OffresCoachingProvider: Offres reçues", offresResponse.data);
      setOffres(offresResponse.data);

      setLoading(false);
      console.log("OffresCoachingProvider: Chargement des données terminé");
    } catch (err) {
      console.error("OffresCoachingProvider: Erreur lors de la récupération des données:", err);
      setError("Une erreur est survenue lors du chargement des données.");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("OffresCoachingProvider: Initialisation du useEffect");
    fetchData();
  }, []);

  // Function to get offers by category
  const getOffresByCategory = (categoryId) => {
    console.log(`OffresCoachingProvider: Recherche des offres pour la catégorie ${categoryId}`);
    const filteredOffres = offres.filter((offre) => offre.categorie_offre_id === categoryId);
    console.log(`OffresCoachingProvider: ${filteredOffres.length} offres trouvées pour la catégorie ${categoryId}`);
    return filteredOffres;
  };

  // Functions to manage categories
  const addCategory = async (newCategory) => {
    try {
      console.log("OffresCoachingProvider: Ajout d'une nouvelle catégorie", newCategory);
      const response = await axiosInstance.post("/categories", newCategory);
      setCategories([...categories, response.data]);
      console.log("OffresCoachingProvider: Catégorie ajoutée avec succès", response.data);
      return response.data;
    } catch (err) {
      console.error("OffresCoachingProvider: Erreur lors de l'ajout de la catégorie:", err);
      throw err;
    }
  };

  const updateCategory = async (categoryId, updatedCategory) => {
    try {
      console.log(`OffresCoachingProvider: Mise à jour de la catégorie ${categoryId}`, updatedCategory);
      const response = await axiosInstance.put(`/categories/${categoryId}`, updatedCategory);
      setCategories(categories.map((cat) => (cat.id === categoryId ? response.data : cat)));
      console.log("OffresCoachingProvider: Catégorie mise à jour avec succès", response.data);
      return response.data;
    } catch (err) {
      console.error("OffresCoachingProvider: Erreur lors de la mise à jour de la catégorie:", err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      console.log(`OffresCoachingProvider: Suppression de la catégorie ${categoryId}`);
      await axiosInstance.delete(`/categories/${categoryId}`);
      setCategories(categories.filter((cat) => cat.id !== categoryId));
      setOffres(offres.filter((offre) => offre.categorie_offre_id !== categoryId));
      console.log("OffresCoachingProvider: Catégorie supprimée avec succès");
    } catch (err) {
      console.error("OffresCoachingProvider: Erreur lors de la suppression de la catégorie:", err);
      throw err;
    }
  };

  // Functions to manage offers
  const addOffre = async (newOffre) => {
    try {
      console.log("OffresCoachingProvider: Ajout d'une nouvelle offre", newOffre);
      const response = await axiosInstance.post("/offres", newOffre);
      setOffres([...offres, response.data]);
      console.log("OffresCoachingProvider: Offre ajoutée avec succès", response.data);
      return response.data;
    } catch (err) {
      console.error("OffresCoachingProvider: Erreur lors de l'ajout de l'offre:", err);
      throw err;
    }
  };

  const updateOffre = async (offreId, updatedOffre) => {
    try {
      console.log(`OffresCoachingProvider: Mise à jour de l'offre ${offreId}`, updatedOffre);
      const response = await axiosInstance.put(`/offres/${offreId}`, updatedOffre);
      setOffres(offres.map((offre) => (offre.id === offreId ? response.data : offre)));
      console.log("OffresCoachingProvider: Offre mise à jour avec succès", response.data);
      return response.data;
    } catch (err) {
      console.error("OffresCoachingProvider: Erreur lors de la mise à jour de l'offre:", err);
      throw err;
    }
  };

  const deleteOffre = async (offreId) => {
    try {
      console.log(`OffresCoachingProvider: Suppression de l'offre ${offreId}`);
      await axiosInstance.delete(`/offres/${offreId}`);
      setOffres(offres.filter((offre) => offre.id !== offreId));
      console.log("OffresCoachingProvider: Offre supprimée avec succès");
    } catch (err) {
      console.error("OffresCoachingProvider: Erreur lors de la suppression de l'offre:", err);
      throw err;
    }
  };

  const value = {
    categories,
    offres,
    loading,
    error,
    getOffresByCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    addOffre,
    updateOffre,
    deleteOffre,
    refreshData: fetchData,
  };

  console.log("OffresCoachingProvider: Rendu du contexte", {
    categoriesCount: categories.length,
    offresCount: offres.length,
    loading,
    error,
  });

  return <OffresCoachingContext.Provider value={value}>{children}</OffresCoachingContext.Provider>;
};

export default OffresCoachingProvider;
