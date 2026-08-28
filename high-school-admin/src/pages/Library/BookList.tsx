import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  BookOpen, 
  Plus, 
  Search, 
  Bookmark, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Layers, 
  BookMarked,
  ArrowRightLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/common/ToastProvider";

interface BookRecord {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  year: number;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
  coverImage?: string;
}

export default function BookList() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const [books, setBooks] = useState<BookRecord[]>([
    {
      id: "bk-1",
      isbn: "978-0134093413",
      title: "Campbell Biology (11th Edition)",
      author: "Lisa A. Urry, Michael L. Cain",
      category: "Science & Biology",
      publisher: "Pearson",
      year: 2020,
      totalCopies: 15,
      availableCopies: 9,
      shelfLocation: "Shelf SCI-A4",
    },
    {
      id: "bk-2",
      isbn: "978-1285740621",
      title: "Calculus: Early Transcendentals",
      author: "James Stewart",
      category: "Mathematics",
      publisher: "Cengage Learning",
      year: 2021,
      totalCopies: 20,
      availableCopies: 14,
      shelfLocation: "Shelf MTH-B1",
    },
    {
      id: "bk-3",
      isbn: "978-0134685991",
      title: "Building Java Programs: A Back to Basics Approach",
      author: "Stuart Reges, Marty Stepp",
      category: "Computer Science",
      publisher: "Pearson",
      year: 2019,
      totalCopies: 12,
      availableCopies: 4,
      shelfLocation: "Shelf CS-C2",
    },
    {
      id: "bk-4",
      isbn: "978-0060935467",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      category: "Literature & Fiction",
      publisher: "Harper Perennial",
      year: 2006,
      totalCopies: 35,
      availableCopies: 22,
      shelfLocation: "Shelf LIT-F3",
    },
    {
      id: "bk-5",
      isbn: "978-0190491826",
      title: "A History of the Modern World",
      author: "R.R. Palmer, Joel Colton",
      category: "History & Humanities",
      publisher: "McGraw-Hill",
      year: 2019,
      totalCopies: 18,
      availableCopies: 7,
      shelfLocation: "Shelf HIS-D2",
    },
  ]);

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    category: "Science & Biology",
    publisher: "",
    year: 2024,
    totalCopies: 10,
    shelfLocation: "Shelf SCI-A1",
  });

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBk: BookRecord = {
      id: `bk-${Date.now()}`,
      isbn: formData.isbn,
      title: formData.title,
      author: formData.author,
      category: formData.category,
      publisher: formData.publisher,
      year: Number(formData.year) || 2024,
      totalCopies: Number(formData.totalCopies) || 5,
      availableCopies: Number(formData.totalCopies) || 5,
      shelfLocation: formData.shelfLocation,
    };
    setBooks((prev) => [newBk, ...prev]);
    setModalOpen(false);
    showToast("Book catalog title registered", "success");
  };

  const filtered = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.shelfLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "All" || b.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Library Catalog & Books"
          subtitle="Explore library holdings, ISBN cataloguing, circulation copies, and shelf locations."
        />
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/library/borrow"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/15 text-stone-700 dark:text-stone-200 text-xs font-semibold transition"
          >
            <ArrowRightLeft size={14} />
            <span>Issue / Borrow</span>
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Book Title</span>
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="flex items-center gap-2 flex-1 w-full">
          <Search size={16} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search book title, author, ISBN, or shelf location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none w-full sm:w-auto font-medium"
        >
          <option value="All">All Categories</option>
          <option value="Science & Biology">Science & Biology</option>
          <option value="Mathematics">Mathematics</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Literature & Fiction">Literature & Fiction</option>
          <option value="History & Humanities">History & Humanities</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">
                      {b.title}
                    </h3>
                    <div className="text-xs text-stone-500 font-medium">{b.author}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">ISBN:</span>
                  <span className="font-mono">{b.isbn}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Category:</span>
                  <span className="font-medium text-brand-600 dark:text-brand-400">
                    {b.category}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Shelf Location:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {b.shelfLocation}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase block">
                  Availability
                </span>
                <span
                  className={`text-xs font-black ${
                    b.availableCopies > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {b.availableCopies} of {b.totalCopies} Available
                </span>
              </div>

              <Link
                to={`/library/borrow?book=${b.id}`}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-500 hover:text-white text-stone-700 dark:text-stone-200 transition"
              >
                Checkout
              </Link>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Add Book to Library
            </h3>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Author(s) *
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    ISBN *
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Science & Biology">Science & Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Literature & Fiction">Literature & Fiction</option>
                    <option value="History & Humanities">History & Humanities</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Shelf Location
                  </label>
                  <input
                    type="text"
                    value={formData.shelfLocation}
                    onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Copies Count
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={formData.totalCopies}
                  onChange={(e) => setFormData({ ...formData, totalCopies: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition cursor-pointer"
                >
                  Add Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
