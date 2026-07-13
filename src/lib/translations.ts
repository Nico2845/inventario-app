import type { ProductStatus } from './productStatus'

export type Language = 'es' | 'en'

export type TranslationKey =
  | 'dashboard'
  | 'products'
  | 'logout'
  | 'newProduct'
  | 'save'
  | 'saving'
  | 'cancel'
  | 'edit'
  | 'delete'
  | 'backToProducts'
  | 'searchPlaceholder'
  | 'filterByCategory'
  | 'filterByStatus'
  | 'noProducts'
  | 'loadingProducts'
  | 'loadingDashboard'
  | 'loadingProduct'
  | 'productNotFound'
  | 'error'
  | 'activeSkus'
  | 'totalInventoryValue'
  | 'expiringSoon'
  | 'inventoryByCategory'
  | 'sku'
  | 'name'
  | 'category'
  | 'stock'
  | 'unitCost'
  | 'price'
  | 'weeklyDemand'
  | 'expirationDate'
  | 'coverage'
  | 'all'
  | 'status'
  | 'actions'
  | 'page'
  | 'of'
  | 'previous'
  | 'next'
  | 'deleteConfirm'
  | 'deleteError'
  | 'loading'
  | 'requiredTextFields'
  | 'requiredFieldPrefix'
  | 'requiredFieldSuffix'
  | 'requiredField'
  | 'createProductSubtitle'
  | 'editProductSubtitle'
  | 'createProductDescription'
  | 'editProductDescription'
  | 'productDetailTitle'
  | 'back'
  | 'days'
  | 'expiringAlertPrefix'
  | 'inventoryValueByCategory'
  | 'chartTooltip'
  | 'newProductButton'
  | 'productFormTitle'
  | 'productFormSubtitle'
  | 'loginTitle'
  | 'loginSubtitle'
  | 'email'
  | 'password'
  | 'loginButton'
  | 'loggingIn'
  | 'loginError'
  | 'accessToInventory'

export const translations: Record<Language, Record<TranslationKey, string>> = {
  es: {
    dashboard: 'Dashboard',
    products: 'Productos',
    logout: 'Cerrar sesión',
    newProduct: 'Nuevo producto',
    save: 'Guardar',
    saving: 'Guardando...',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    backToProducts: '← Volver a productos',
    searchPlaceholder: 'Buscar por nombre o SKU...',
    filterByCategory: 'Filtrar por categoría',
    filterByStatus: 'Filtrar por estado',
    noProducts: 'No se encontraron productos con esos filtros.',
    loadingProducts: 'Cargando productos...',
    loadingDashboard: 'Cargando dashboard...',
    loadingProduct: 'Cargando producto...',
    productNotFound: 'Producto no encontrado.',
    error: 'Error',
    activeSkus: 'Total de SKUs activos',
    totalInventoryValue: 'Valor total del inventario',
    expiringSoon: 'SKUs próximos a vencer',
    inventoryByCategory: 'Valor de inventario por categoría',
    sku: 'SKU',
    name: 'Nombre',
    category: 'Categoría',
    stock: 'Stock',
    unitCost: 'Costo unitario',
    price: 'Precio',
    weeklyDemand: 'Demanda semanal',
    expirationDate: 'Fecha de vencimiento',
    coverage: 'Cobertura',
    all: 'Todos',
    status: 'Estado',
    actions: 'Acciones',
    page: 'Página',
    of: 'de',
    previous: 'Anterior',
    next: 'Siguiente',
    deleteConfirm: '¿Seguro que quieres eliminar',
    deleteError: 'No se pudo eliminar el producto.',
    loading: 'Cargando...',
    requiredTextFields: 'Todos los campos de texto son obligatorios.',
    requiredFieldPrefix: 'El campo',
    requiredFieldSuffix: 'es obligatorio.',
    requiredField: 'El campo es obligatorio.',
    createProductSubtitle: 'Completa los datos del producto para registrarlo',
    editProductSubtitle: 'Actualiza la información del producto',
    createProductDescription: 'Completa los datos del producto para registrarlo',
    editProductDescription: 'Actualiza la información del producto',
    productDetailTitle: 'Detalle de producto',
    back: 'Volver',
    days: 'días',
    expiringAlertPrefix: '⚠️ Este producto vence en',
    inventoryValueByCategory: 'Valor del inventario por categoría',
    chartTooltip: 'Valor',
    newProductButton: '+ Nuevo producto',
    productFormTitle: 'Producto',
    productFormSubtitle: 'Gestiona la información del producto',
    loginTitle: 'Iniciar sesión',
    loginSubtitle: 'Accede a tu panel de inventario',
    email: 'Email',
    password: 'Contraseña',
    loginButton: 'Ingresar',
    loggingIn: 'Ingresando...',
    loginError: 'No se pudo iniciar sesión.',
    accessToInventory: 'Accede a tu panel de inventario',
  },
  en: {
    dashboard: 'Dashboard',
    products: 'Products',
    logout: 'Log out',
    newProduct: 'New product',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    backToProducts: '← Back to products',
    searchPlaceholder: 'Search by name or SKU...',
    filterByCategory: 'Filter by category',
    filterByStatus: 'Filter by status',
    noProducts: 'No products found with those filters.',
    loadingProducts: 'Loading products...',
    loadingDashboard: 'Loading dashboard...',
    loadingProduct: 'Loading product...',
    productNotFound: 'Product not found.',
    error: 'Error',
    activeSkus: 'Total active SKUs',
    totalInventoryValue: 'Total inventory value',
    expiringSoon: 'SKUs expiring soon',
    inventoryByCategory: 'Inventory value by category',
    sku: 'SKU',
    name: 'Name',
    category: 'Category',
    stock: 'Stock',
    unitCost: 'Unit cost',
    price: 'Price',
    weeklyDemand: 'Weekly demand',
    expirationDate: 'Expiration date',
    coverage: 'Coverage',
    all: 'All',
    status: 'Status',
    actions: 'Actions',
    page: 'Page',
    of: 'of',
    previous: 'Previous',
    next: 'Next',
    deleteConfirm: 'Are you sure you want to delete',
    deleteError: 'Could not delete the product.',
    loading: 'Loading...',
    requiredTextFields: 'All text fields are required.',
    requiredFieldPrefix: 'The field',
    requiredFieldSuffix: 'is required.',
    requiredField: 'The field is required.',
    createProductSubtitle: 'Fill in the product details to register it',
    editProductSubtitle: 'Update the product information',
    createProductDescription: 'Fill in the product details to register it',
    editProductDescription: 'Update the product information',
    productDetailTitle: 'Product detail',
    back: 'Back',
    days: 'days',
    expiringAlertPrefix: '⚠️ This product expires in',
    inventoryValueByCategory: 'Inventory value by category',
    chartTooltip: 'Value',
    newProductButton: '+ New product',
    productFormTitle: 'Product',
    productFormSubtitle: 'Manage product information',
    loginTitle: 'Log in',
    loginSubtitle: 'Access your inventory dashboard',
    email: 'Email',
    password: 'Password',
    loginButton: 'Log in',
    loggingIn: 'Logging in...',
    loginError: 'Could not sign in.',
    accessToInventory: 'Access your inventory dashboard',
  },
}

export function getStatusLabel(status: ProductStatus, language: Language): string {
  const labels: Record<Language, Record<ProductStatus, string>> = {
    es: {
      Crítico: 'Crítico',
      Bajo: 'Bajo',
      Saludable: 'Saludable',
      Exceso: 'Exceso',
    },
    en: {
      Crítico: 'Critical',
      Bajo: 'Low',
      Saludable: 'Healthy',
      Exceso: 'Excess',
    },
  }

  return labels[language][status]
}
