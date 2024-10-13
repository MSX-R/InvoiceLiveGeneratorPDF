import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useOffresCoaching } from "../contexts/OffresCoachingContext";
import { FaPlus, FaEdit, FaTrash, FaUndo, FaChevronDown } from "react-icons/fa";
import { couleursTailwind } from "../config/couleursTailwind";

const ModalEditionOffres = ({ isOpen, onClose }) => {
  const { categories, offres, addCategory, updateCategory, deleteCategory, addOffre, updateOffre, deleteOffre, refreshData } = useOffresCoaching();

  const [localCategories, setLocalCategories] = useState([]);
  const [localOffres, setLocalOffres] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ nom: "", type: "", duree: "", description: "", couleur: "", icone: "" });
  const [newOffre, setNewOffre] = useState({ nom: "", type: "", duree_contrat: 0, nb_seances: 0, prix_total: 0, prix_mensuel: 0, prix_semaine: 0, prix_seance: 0 });
  const [editingOffre, setEditingOffre] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLocalCategories(categories);
      setLocalOffres(offres);
    }
  }, [isOpen, categories, offres]);

  // Automatisation des calculs pour nouvelle offre
  useEffect(() => {
    if (newOffre.nb_seances > 0 && newOffre.prix_seance > 0) {
      const prixTotal = Math.ceil(newOffre.nb_seances * newOffre.prix_seance);
      let prixMensuel = 0;
      let prixSemaine = 0;

      if (newOffre.type === "Suivi") {
        prixMensuel = Math.ceil(prixTotal / 3);
        prixSemaine = Math.ceil(prixMensuel / 4);
      }

      setNewOffre((prev) => ({
        ...prev,
        prix_total: prixTotal,
        prix_mensuel: prixMensuel,
        prix_semaine: prixSemaine,
      }));
    }
  }, [newOffre.nb_seances, newOffre.prix_seance, newOffre.type]);

  // Automatisation des calculs pour offre en édition
  useEffect(() => {
    if (editingOffre) {
      if (editingOffre.nb_seances > 0 && editingOffre.prix_seance > 0) {
        const prixTotal = Math.ceil(editingOffre.nb_seances * editingOffre.prix_seance);
        let prixMensuel = 0;
        let prixSemaine = 0;

        if (editingOffre.type === "Suivi") {
          prixMensuel = Math.ceil(prixTotal / 3);
          prixSemaine = Math.ceil(prixMensuel / 4);
        }

        setEditingOffre((prev) => ({
          ...prev,
          prix_total: prixTotal,
          prix_mensuel: prixMensuel,
          prix_semaine: prixSemaine,
        }));
      }
    }
  }, [editingOffre?.nb_seances, editingOffre?.prix_seance, editingOffre?.type]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const addedCategory = await addCategory(newCategory);
    setLocalCategories([...localCategories, addedCategory]);
    setNewCategory({ nom: "", type: "", duree: "", description: "", couleur: "", icone: "" });
    handleClose();
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (selectedCategory) {
      const updatedCategory = await updateCategory(selectedCategory.id, selectedCategory);
      setLocalCategories(localCategories.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)));
      setSelectedCategory(null);
    }
    handleClose();
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      await deleteCategory(categoryId);
      setLocalCategories(localCategories.filter((cat) => cat.id !== categoryId));
      setLocalOffres(localOffres.filter((offre) => offre.categorie_offre_id !== categoryId));
      setSelectedCategory(null);
    }
    handleClose();
  };

  const handleAddOffre = async (e) => {
    e.preventDefault();
    if (selectedCategory) {
      const addedOffre = await addOffre({ ...newOffre, categorie_offre_id: selectedCategory.id });
      setLocalOffres([...localOffres, addedOffre]);
      setNewOffre({ nom: "", type: "", duree_contrat: 0, nb_seances: 0, prix_total: 0, prix_mensuel: 0, prix_semaine: 0, prix_seance: 0 });
    }
    handleClose();
  };

  const handleUpdateOffre = async (e) => {
    e.preventDefault();
    if (editingOffre) {
      const updatedOffre = await updateOffre(editingOffre.id, editingOffre);
      setLocalOffres(localOffres.map((o) => (o.id === updatedOffre.id ? updatedOffre : o)));
      setEditingOffre(null);
    }
    handleClose();
  };

  const handleDeleteOffre = async (offreId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) {
      await deleteOffre(offreId);
      setLocalOffres(localOffres.filter((offre) => offre.id !== offreId));
    }
    handleClose();
  };

  const handleClose = () => {
    refreshData();
    onClose();
  };

  const resetCategoryForm = () => {
    setSelectedCategory(null);
    setNewCategory({ nom: "", type: "", duree: "", description: "", couleur: "", icone: "" });
  };

  const resetOfferForm = () => {
    setEditingOffre(null);
    setNewOffre({ nom: "", type: "", duree_contrat: 0, nb_seances: 0, prix_total: 0, prix_mensuel: 0, prix_semaine: 0, prix_seance: 0 });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-3xl font-bold leading-6 text-gray-900 mb-8">
                  Gestion des Offres et Catégories
                </Dialog.Title>
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Section Catégories */}
                  <div className="w-full lg:w-1/2">
                    <h4 className="text-2xl font-semibold mb-4 text-gray-800">Catégories</h4>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 max-h-96 overflow-y-auto">
                      {localCategories.map((category) => (
                        <div key={category.id} className="bg-white rounded-lg shadow-sm p-4 mb-3 transition-all hover:shadow-md">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full ${category.couleur} flex items-center justify-center text-white font-bold`}>{category.id}</div>
                              <span className="text-lg font-medium">{category.nom}</span>
                            </div>
                            <div className="flex space-x-2">
                              <button onClick={() => setSelectedCategory(category)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                                <FaEdit />
                              </button>
                              <button onClick={() => handleDeleteCategory(category.id)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={selectedCategory ? handleUpdateCategory : handleAddCategory} className="bg-white p-6 rounded-lg shadow-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cat-nom" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom
                          </label>
                          <input id="cat-nom" type="text" value={selectedCategory ? selectedCategory.nom : newCategory.nom} onChange={(e) => (selectedCategory ? setSelectedCategory({ ...selectedCategory, nom: e.target.value }) : setNewCategory({ ...newCategory, nom: e.target.value }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                          <label htmlFor="cat-type" className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                          </label>
                          <select id="cat-type" value={selectedCategory ? selectedCategory.type : newCategory.type} onChange={(e) => (selectedCategory ? setSelectedCategory({ ...selectedCategory, type: e.target.value }) : setNewCategory({ ...newCategory, type: e.target.value }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Sélectionnez un type</option>
                            <option value="Essai">Essai</option>
                            <option value="Solo">Solo</option>
                            <option value="Duo">Duo</option>
                            <option value="SmallGroup">Small Group</option>
                            <option value="Programme">Programme</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="cat-duree" className="block text-sm font-medium text-gray-700 mb-1">
                            Durée
                          </label>
                          <input id="cat-duree" type="text" value={selectedCategory ? selectedCategory.duree : newCategory.duree} onChange={(e) => (selectedCategory ? setSelectedCategory({ ...selectedCategory, duree: e.target.value }) : setNewCategory({ ...newCategory, duree: e.target.value }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                          <label htmlFor="cat-couleur" className="block text-sm font-medium text-gray-700 mb-1">
                            Couleur
                          </label>
                          <select id="cat-couleur" value={selectedCategory ? selectedCategory.couleur : newCategory.couleur} onChange={(e) => (selectedCategory ? setSelectedCategory({ ...selectedCategory, couleur: e.target.value }) : setNewCategory({ ...newCategory, couleur: e.target.value }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Sélectionnez une couleur</option>
                            {couleursTailwind.map((couleur) => (
                              <option key={couleur.classe} value={couleur.classe}>
                                {couleur.nom}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label htmlFor="cat-description" className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea id="cat-description" value={selectedCategory ? selectedCategory.description : newCategory.description} onChange={(e) => (selectedCategory ? setSelectedCategory({ ...selectedCategory, description: e.target.value }) : setNewCategory({ ...newCategory, description: e.target.value }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows="3" />
                      </div>
                      <div className="mt-4 flex justify-between">
                        <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg">
                          {selectedCategory ? "Mettre à jour" : "Ajouter"} la catégorie
                        </button>
                        <button type="button" onClick={resetCategoryForm} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-all">
                          <FaUndo className="inline-block mr-2" /> Réinitialiser
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Section Offres */}
                  <div className="w-full lg:w-1/2">
                    <h4 className="text-2xl font-semibold mb-4 text-gray-800">Offres</h4>
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 max-h-96 overflow-y-auto">
                      {selectedCategory &&
                        localOffres
                          .filter((offre) => offre.categorie_offre_id === selectedCategory.id)
                          .map((offre) => (
                            <div key={offre.id} className="bg-white rounded-lg shadow-sm p-4 mb-3 transition-all hover:shadow-md">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-medium">{offre.nom}</span>
                                <div className="flex space-x-2">
                                  <button onClick={() => setEditingOffre(offre)} className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors">
                                    <FaEdit />
                                  </button>
                                  <button onClick={() => handleDeleteOffre(offre.id)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                              <div className="mt-2 text-sm text-gray-600">
                                Prix: {offre.prix_total}€ | Séances: {offre.nb_seances}
                              </div>
                            </div>
                          ))}
                    </div>
                    <form onSubmit={editingOffre ? handleUpdateOffre : handleAddOffre} className="bg-white p-6 rounded-lg shadow-sm">
                      <fieldset disabled={!selectedCategory && !newCategory.nom}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="offre-nom" className="block text-sm font-medium text-gray-700 mb-1">
                              Nom
                            </label>
                            <input id="offre-nom" type="text" value={editingOffre ? editingOffre.nom : newOffre.nom} onChange={(e) => (editingOffre ? setEditingOffre({ ...editingOffre, nom: e.target.value }) : setNewOffre({ ...newOffre, nom: e.target.value }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                          <div>
                            <label htmlFor="offre-type" className="block text-sm font-medium text-gray-700 mb-1">
                              Type
                            </label>
                            <select id="offre-type" value={editingOffre ? editingOffre.type : newOffre.type} onChange={(e) => (editingOffre ? setEditingOffre({ ...editingOffre, type: e.target.value }) : setNewOffre({ ...newOffre, type: e.target.value }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <option value="">Sélectionnez un type</option>
                              <option value="Unitaire">Unitaire</option>
                              <option value="Pack">Pack</option>
                              <option value="Suivi">Suivi</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="offre-duree" className="block text-sm font-medium text-gray-700 mb-1">
                              Durée du contrat
                            </label>
                            <input id="offre-duree" type="number" value={editingOffre ? editingOffre.duree_contrat : newOffre.duree_contrat} onChange={(e) => (editingOffre ? setEditingOffre({ ...editingOffre, duree_contrat: Number(e.target.value) }) : setNewOffre({ ...newOffre, duree_contrat: Number(e.target.value) }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                          <div>
                            <label htmlFor="offre-seances" className="block text-sm font-medium text-gray-700 mb-1">
                              Nombre de séances
                            </label>
                            <input id="offre-seances" type="number" value={editingOffre ? editingOffre.nb_seances : newOffre.nb_seances} onChange={(e) => (editingOffre ? setEditingOffre({ ...editingOffre, nb_seances: Number(e.target.value) }) : setNewOffre({ ...newOffre, nb_seances: Number(e.target.value) }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                          <div>
                            <label htmlFor="offre-prix-total" className="block text-sm font-medium text-gray-700 mb-1">
                              Prix total
                            </label>
                            <input id="offre-prix-total" type="number" step="0.01" value={editingOffre ? editingOffre.prix_total : newOffre.prix_total} onChange={(e) => (editingOffre ? setEditingOffre({ ...editingOffre, prix_total: Number(e.target.value) }) : setNewOffre({ ...newOffre, prix_total: Number(e.target.value) }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                          <div>
                            <label htmlFor="offre-prix-mensuel" className="block text-sm font-medium text-gray-700 mb-1">
                              Prix mensuel
                            </label>
                            <input id="offre-prix-mensuel" type="number" step="0.01" value={editingOffre ? editingOffre.prix_mensuel : newOffre.prix_mensuel} onChange={(e) => (editingOffre ? setEditingOffre({ ...editingOffre, prix_mensuel: Number(e.target.value) }) : setNewOffre({ ...newOffre, prix_mensuel: Number(e.target.value) }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                          <div>
                            <label htmlFor="offre-prix-semaine" className="block text-sm font-medium text-gray-700 mb-1">
                              Prix par semaine
                            </label>
                            <input id="offre-prix-semaine" type="number" step="0.01" value={editingOffre ? editingOffre.prix_semaine : newOffre.prix_semaine} onChange={(e) => (editingOffre ? setEditingOffre({ ...editingOffre, prix_semaine: Number(e.target.value) }) : setNewOffre({ ...newOffre, prix_semaine: Number(e.target.value) }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                          <div>
                            <label htmlFor="offre-prix-seance" className="block text-sm font-medium text-gray-700 mb-1">
                              Prix par séance
                            </label>
                            <input id="offre-prix-seance" type="number" step="0.01" value={editingOffre ? editingOffre.prix_seance : newOffre.prix_seance} onChange={(e) => (editingOffre ? setEditingOffre({ ...editingOffre, prix_seance: Number(e.target.value) }) : setNewOffre({ ...newOffre, prix_seance: Number(e.target.value) }))} className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <button type="submit" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-full hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg">
                            {editingOffre ? "Mettre à jour" : "Ajouter"} l'offre
                          </button>
                          <button type="button" onClick={resetOfferForm} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-300 transition-all">
                            <FaUndo className="inline-block mr-2" /> Réinitialiser
                          </button>
                        </div>
                      </fieldset>
                    </form>
                  </div>
                </div>
                <div className="mt-8 text-right">
                  <button type="button" className="inline-flex justify-center rounded-full border border-transparent bg-blue-100 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all" onClick={handleClose}>
                    Fermer
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalEditionOffres;
