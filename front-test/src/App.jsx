import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/auth/login";
import { Dashboard } from "./pages/adminView/dashboard";
import { DashboardLayout } from "./layout/dashboard";
import { Products } from "./pages/adminView/products";
import { Category } from "./pages/adminView/category";
import { CategoryForm } from "./components/forms/categoryForm";
import { ProductForm } from "./components/forms/productForm";
import { ProductView } from "./components/product/productView";
import { Packs } from "./pages/adminView/packs";
import { ProductProvider } from "./context/productContext";

import Vente from "./pages/adminView/vente";
import VenteView from "./components/ventes/venteView";
import PackForm from "./components/forms/packForm";
import { PromoCode } from "./pages/adminView/promoCode";
import PromoCodeForm from "./components/forms/promoCode";
import PackView from "./components/pack/packView";
import General from "./pages/adminView/general";
import Advanced from "./pages/adminView/advanced";
import Clients from "./pages/adminView/clients";
import VenteForm from "./components/forms/venteForm";
import BDCPrint from "./pages/adminView/print/BDCPrint";
import FacturePrint from "./pages/adminView/print/facturePrint";
import TicketPrint from "./pages/adminView/print/ticketPrint";
import BDLPrint from "./pages/adminView/print/BDL";
import DevisPrint from "./pages/adminView/print/devis";
import { BlogForm } from "./components/forms/blogForm";
import BlogView from "./components/blog/blogView";
import Blogs from "./pages/adminView/blog";
import { MaterielImageSectionForm } from "./components/forms/materielImageSectionForm";
import ClientForm from "./components/forms/clientForm";
import SlideForm from "./components/forms/slideForm";
import ClientView from "./components/client/clientView";
import BrandsManagement from "./components/forms/brandsForm";
import { MessagesList } from "./pages/adminView/messages";
import { ProtectedRoute } from "./components/protectedRoute";
import BarcodeScanner from "./components/scanBarCode";
import PagesPage from "./pages/adminView/pages";
import { PageForm } from "./components/forms/pageForm";
import PageView from "./components/pages/pageView";

function App() {
  return (
    <ProductProvider>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Products routes */}
            <Route path="/inventory/products" element={<Products />} />
            <Route path="/inventory/products/new" element={<ProductForm />} />
            <Route
              path="/inventory/products/edit/:id"
              element={<ProductForm />}
            />
            <Route path="/inventory/products/:id" element={<ProductView />} />
            {/* Categories routes */}
            <Route path="/categories" element={<Category />} />
            <Route path="/categories/new" element={<CategoryForm />} />
            <Route path="/categories/update/:id" element={<CategoryForm />} />
            {/* Packs routes */}
            <Route path="/inventory/packs" element={<Packs />} />
            <Route path="/inventory/packs/new" element={<PackForm />} />
            <Route path="/inventory/packs/edit/:id" element={<PackForm />} />
            <Route path="/inventory/packs/:id" element={<PackView />} />
            {/* PromoCode routes */}
            <Route path="/inventory/promo-codes" element={<PromoCode />} />
            <Route
              path="/inventory/promo-codes/new"
              element={<PromoCodeForm />}
            />
            <Route
              path="/inventory/promo-codes/edit/:id"
              element={<PromoCodeForm />}
            />
            {/* Settings routes */}
            <Route path="/settings/general" element={<General />} />
            <Route path="/settings/advanced" element={<Advanced />} />
            <Route
              path="/media-settings/materiel-image"
              element={<MaterielImageSectionForm />}
            />
            <Route path="/media-settings/slides" element={<SlideForm />} />
            <Route
              path="/media-settings/marque"
              element={<BrandsManagement />}
            />
            {/* Clients routes */}
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/edit/:id" element={<ClientForm />} />
            <Route path="/clients/:id" element={<ClientView />} />
            {/* Ventes routes */}
            <Route path="/vente" element={<Vente />} />
            <Route path="/vente/:id" element={<VenteView />} />
            <Route path="/vente/new" element={<VenteForm />} />
            <Route path="/vente/edit/:id" element={<VenteForm />} />
            {/* Print routes */}
            <Route path="/vente/print/bdc/:id" element={<BDCPrint />} />
            <Route path="/vente/print/facture/:id" element={<FacturePrint />} />
            <Route path="/vente/print/ticket/:id" element={<TicketPrint />} />
            <Route path="/vente/print/bdl/:id" element={<BDLPrint />} />
            <Route path="/vente/print/devis/:id" element={<DevisPrint />} />
            {/* Blog routes */}
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/new" element={<BlogForm />} />
            <Route path="/blogs/edit/:id" element={<BlogForm />} />
            <Route path="/blogs/view/:id" element={<BlogView />} />
            {/* Messages routes */}
            <Route path="/messages" element={<MessagesList />} />
            <Route path="/scan" element={<BarcodeScanner />} />
            {/* Pages routes */}
            <Route path="/pages" element={<PagesPage />} />
            <Route path="/pages/new" element={<PageForm />} />
            <Route path="/pages/edit/:id" element={<PageForm />} />
            <Route path="/pages/:slug" element={<PageView />} />
          </Route>
          <Route path="*" element={<h1>Not found</h1>} />
        </Routes>
      </main>
    </ProductProvider>
  );
}

export default App;
