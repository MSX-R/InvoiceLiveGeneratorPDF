import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from "react";
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

  const axiosInstanceRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || "your-auth-token";
    axiosInstanceRef.current = axios.create({
      baseURL: "https://msxghost.boardy.fr/api",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    fetchData();
  }, []);

  const fetchData = useCallback(async () => {
    console.log("OffresCoachingProvider: Début du chargement des données");
    try {
      setLoading(true);
      setError(null);

      const [categoriesResponse, offresResponse] = await Promise.all([axiosInstanceRef.current.get("/categories"), axiosInstanceRef.current.get("/offres")]);

      setCategories(categoriesResponse.data);
      setOffres(offresResponse.data);

      setLoading(false);
      console.log("OffresCoachingProvider: Chargement des données terminé");
    } catch (err) {
      console.error("OffresCoachingProvider: Erreur lors de la récupération des données:", err);
      setError("Une erreur est survenue lors du chargement des données.");
      setLoading(false);
    }
  }, []);

  const getOffresByCategory = useCallback(
    (categoryId) => {
      return offres.filter((offre) => offre.categorie_offre_id === categoryId);
    },
    [offres]
  );

  const addCategory = async (newCategory) => {
    try {
      const response = await axiosInstanceRef.current.post("/categories", newCategory);
      setCategories((prevCategories) => [...prevCategories, response.data]);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de l'ajout de la catégorie:", err);
      throw err;
    }
  };

  const updateCategory = async (categoryId, updatedCategory) => {
    try {
      const response = await axiosInstanceRef.current.put(`/categories/${categoryId}`, updatedCategory);
      setCategories((prevCategories) => prevCategories.map((cat) => (cat.id === categoryId ? response.data : cat)));
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la catégorie:", err);
      throw err;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await axiosInstanceRef.current.delete(`/categories/${categoryId}`);
      setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== categoryId));
      setOffres((prevOffres) => prevOffres.filter((offre) => offre.categorie_offre_id !== categoryId));
    } catch (err) {
      console.error("Erreur lors de la suppression de la catégorie:", err);
      throw err;
    }
  };

  const addOffre = async (newOffre) => {
    try {
      const response = await axiosInstanceRef.current.post("/offres", newOffre);
      setOffres((prevOffres) => [...prevOffres, response.data]);
      return response.data;
    } catch (err) {
      console.error("Erreur lors de l'ajout de l'offre:", err);
      throw err;
    }
  };

  const updateOffre = async (offreId, updatedOffre) => {
    try {
      const response = await axiosInstanceRef.current.put(`/offres/${offreId}`, updatedOffre);
      setOffres((prevOffres) => prevOffres.map((offre) => (offre.id === offreId ? response.data : offre)));
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'offre:", err);
      throw err;
    }
  };

  const deleteOffre = async (offreId) => {
    try {
      await axiosInstanceRef.current.delete(`/offres/${offreId}`);
      setOffres((prevOffres) => prevOffres.filter((offre) => offre.id !== offreId));
    } catch (err) {
      console.error("Erreur lors de la suppression de l'offre:", err);
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

  return <OffresCoachingContext.Provider value={value}>{children}</OffresCoachingContext.Provider>;
};

export default OffresCoachingProvider;
