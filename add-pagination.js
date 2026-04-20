const fs = require('fs');

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// Add imports
content = content.replace(
  "import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';",
  "import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from 'react-icons/hi';\nimport { Pagination } from '@/components/Pagination';"
);

// Add Pagination States
content = content.replace(
  "const [users, setUsers] = useState([]);",
  "const [users, setUsers] = useState([]);\n  const [usersPage, setUsersPage] = useState(1);\n  const [productsPage, setProductsPage] = useState(1);\n  const [ordersPage, setOrdersPage] = useState(1);\n  const [reviewsPage, setReviewsPage] = useState(1);\n  const ITEMS_PER_PAGE = 10;"
);

content = content.replace("users.map((u: any) =>", "users.slice((usersPage - 1) * ITEMS_PER_PAGE, usersPage * ITEMS_PER_PAGE).map((u: any) =>");
content = content.replace("products.map((product: any) =>", "products.slice((productsPage - 1) * ITEMS_PER_PAGE, productsPage * ITEMS_PER_PAGE).map((product: any) =>");
content = content.replace("orders.map((order: any) =>", "orders.slice((ordersPage - 1) * ITEMS_PER_PAGE, ordersPage * ITEMS_PER_PAGE).map((order: any) =>");
content = content.replace("productReviews.map((review: any) =>", "productReviews.slice((reviewsPage - 1) * ITEMS_PER_PAGE, reviewsPage * ITEMS_PER_PAGE).map((review: any) =>");

content = content.replace(
  "</table>\n        </div>\n      )}\n\n      {tab === 'products'",
  "</table>\n          <Pagination currentPage={usersPage} totalItems={users.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setUsersPage} />\n        </div>\n      )}\n\n      {tab === 'products'"
);

content = content.replace(
  "</table>\n        </div>\n      )}\n\n      {tab === 'orders'",
  "</table>\n          <Pagination currentPage={productsPage} totalItems={products.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setProductsPage} />\n        </div>\n      )}\n\n      {tab === 'orders'"
);

content = content.replace(
  "</table>\n        </div>\n      )}\n\n      {tab === 'reviews'",
  "</table>\n          <Pagination currentPage={ordersPage} totalItems={orders.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setOrdersPage} />\n        </div>\n      )}\n\n      {tab === 'reviews'"
);

content = content.replace(
  "</div>\n           )}\n        </div>\n      )}\n\n      {tab === 'settings'",
  "</div>\n           )}\n           <div className=\"mt-4\"><Pagination currentPage={reviewsPage} totalItems={productReviews.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setReviewsPage} /></div>\n        </div>\n      )}\n\n      {tab === 'settings'"
);

fs.writeFileSync('src/app/admin/page.tsx', content);
console.log('Done admin pagination!');
