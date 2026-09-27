import { useState, useMemo } from "react";
import { EmptyState, EmptyTableRow } from "@/components/ui/empty-state";
import {
  Copy,
  Plus,
  Search,
  Check,
  Edit2,
  Trash2,
  Eye,
  FileText,
  Sparkles,
  BarChart3,
  Layers,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  INITIAL_RESPONSE_TEMPLATES,
  RESPONSE_TEMPLATE_STATS,
  RESPONSE_TEMPLATE_USAGE_CHART_DATA,
  type ResponseTemplateItem,
} from "@/data/reviews-response-templates";

export function ReviewsResponseTemplatesTab() {
  const [templates, setTemplates] = useState<ResponseTemplateItem[]>(INITIAL_RESPONSE_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ResponseTemplateItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<ResponseTemplateItem["category"]>("Service");
  const [formRating, setFormRating] = useState<ResponseTemplateItem["targetRating"]>("5-Star");
  const [formSentiment, setFormSentiment] = useState<ResponseTemplateItem["sentiment"]>("Positive");
  const [formStatus, setFormStatus] = useState<ResponseTemplateItem["status"]>("Approved");
  const [formContent, setFormContent] = useState("");
  const [formVariables, setFormVariables] = useState<string[]>(["Customer_Name", "Store_Name"]);

  // Test & Preview Modal State
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<ResponseTemplateItem | null>(null);
  const [variableInputs, setVariableInputs] = useState<Record<string, string>>({
    Customer_Name: "Rajesh Sharma",
    Store_Name: "Demo Store 371",
    City: "New Delhi",
    Manager_Phone: "+91 98765 43210",
    Product_Name: "Sports Shoes",
    Promo_Code: "DISCOUNT10",
    Order_ID: "ORD-98214",
    Support_Email: "support@insightsrank.com",
    Campaign_Name: "Summer Sale 2026",
  });

  // Filter Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchesSearch =
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || tpl.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesRating =
        selectedRating === "all" || tpl.targetRating.toLowerCase() === selectedRating.toLowerCase();

      const matchesStatus =
        selectedStatus === "all" || tpl.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesRating && matchesStatus;
    });
  }, [templates, searchQuery, selectedCategory, selectedRating, selectedStatus]);

  // Copy Template Handler
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Template copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormTitle("");
    setFormCategory("Service");
    setFormRating("5-Star");
    setFormSentiment("Positive");
    setFormStatus("Approved");
    setFormContent(
      "Hi {Customer_Name}, thank you for visiting {Store_Name}! We appreciate your feedback and hope to see you again soon."
    );
    setFormVariables(["Customer_Name", "Store_Name"]);
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (tpl: ResponseTemplateItem) => {
    setEditingTemplate(tpl);
    setFormTitle(tpl.title);
    setFormCategory(tpl.category);
    setFormRating(tpl.targetRating);
    setFormSentiment(tpl.sentiment);
    setFormStatus(tpl.status);
    setFormContent(tpl.content);
    setFormVariables(tpl.variables);
    setModalOpen(true);
  };

  // Save Create / Edit
  const handleSaveTemplate = () => {
    if (!formTitle.trim() || !formContent.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTemplate.id
            ? {
                ...t,
                title: formTitle,
                category: formCategory,
                targetRating: formRating,
                sentiment: formSentiment,
                status: formStatus,
                content: formContent,
                variables: formVariables,
                lastUpdated: "Just Now",
              }
            : t
        )
      );
      toast.success("Response template updated successfully!");
    } else {
      const newTpl: ResponseTemplateItem = {
        id: `tpl-${Date.now()}`,
        title: formTitle,
        category: formCategory,
        targetRating: formRating,
        sentiment: formSentiment,
        variables: formVariables,
        content: formContent,
        usageCount: 0,
        status: formStatus,
        lastUpdated: "Just Now",
        author: "Current User",
      };
      setTemplates((prev) => [newTpl, ...prev]);
      toast.success("New response template created successfully!");
    }
    setModalOpen(false);
  };

  // Delete Template
  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    toast.success("Template removed.");
  };

  // Open Test Preview Modal
  const handleOpenPreview = (tpl: ResponseTemplateItem) => {
    setPreviewTemplate(tpl);
    setPreviewModalOpen(true);
  };

  // Compiled Preview Output
  const compiledPreviewText = useMemo(() => {
    if (!previewTemplate) return "";
    let text = previewTemplate.content;
    Object.entries(variableInputs).forEach(([key, val]) => {
      text = text.replaceAll(`{${key}}`, val || `{${key}}`);
    });
    return text;
  }, [previewTemplate, variableInputs]);

  return (
    <div className="rounded-2xl bg-card dark:bg-[#141416] p-6 sm:p-8 space-y-6 shadow-xl border border-border">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            Response Templates
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Standardize AI & manual customer review responses with approved brand templates.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-4 cursor-pointer gap-1.5 shadow-sm"
        >
          <Plus className="size-4" />
          <span>Create Template</span>
        </Button>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RESPONSE_TEMPLATE_STATS.map((stat) => (
          <div key={stat.label} className="panel p-4 flex flex-col justify-between space-y-2">
            <div className="flex items-center gap-1.5 text-blue-500">
              <Sparkles className="size-3.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
                {stat.label}
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <p className="tnum text-2xl font-extrabold tracking-tight text-foreground">
                  {stat.value}
                </p>
                <span className="text-xs font-bold text-emerald-400 tnum">
                  {stat.change}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {stat.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Template Usage Chart & Category Stats */}
      <div className="grid gap-4 lg:grid-cols-[2fr_1fr] items-stretch">
        <div className="panel p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Template Usage Distribution by Category
            </h3>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={RESPONSE_TEMPLATE_USAGE_CHART_DATA}
                margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
              >
                <CartesianGrid stroke="var(--border)" vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    fontSize: 12,
                    color: "var(--popover-foreground)",
                  }}
                />
                <Bar dataKey="count" name="Total Uses" fill="#facc15" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-4 sm:p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="size-4 text-blue-500" />
            <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
              Quick Highlights
            </h3>
          </div>

          <div className="space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center justify-between p-2 rounded bg-secondary/40 border border-border">
              <span>Most Used Template:</span>
              <span className="font-bold text-foreground">5-Star Appreciation</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-secondary/40 border border-border">
              <span>Recovery Rate:</span>
              <span className="font-bold text-emerald-400">84.5% Resolution</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-secondary/40 border border-border">
              <span>AI Auto-Suggest Enabled:</span>
              <span className="font-bold text-blue-400">Active</span>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground italic">
            * All templates include dynamic variables `{`{Customer_Name}`}` and `{`{Store_Name}`}` for instant auto-fill.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="panel p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="size-3.5 text-muted-foreground absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search templates or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded bg-background border border-border pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-8 w-36 bg-background border-border text-foreground text-xs cursor-pointer">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="pricing">Pricing</SelectItem>
              <SelectItem value="ambience">Ambience</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>

          {/* Rating Filter */}
          <Select value={selectedRating} onValueChange={setSelectedRating}>
            <SelectTrigger className="h-8 w-32 bg-background border-border text-foreground text-xs cursor-pointer">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5-star">5-Star</SelectItem>
              <SelectItem value="4-star">4-Star</SelectItem>
              <SelectItem value="3-star">3-Star</SelectItem>
              <SelectItem value="1-2 star">1-2 Star Recovery</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-8 w-28 bg-background border-border text-foreground text-xs cursor-pointer">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-secondary/40 border border-border p-1 rounded-md">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1 rounded cursor-pointer transition-colors ${
              viewMode === "grid" ? "bg-card dark:bg-[#27272a] text-blue-500 font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Grid View"
          >
            <Grid className="size-3.5" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1 rounded cursor-pointer transition-colors ${
              viewMode === "table" ? "bg-card dark:bg-[#27272a] text-blue-500 font-bold shadow-xs" : "text-muted-foreground hover:text-foreground"
            }`}
            title="Table View"
          >
            <List className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Main Templates Display */}
      {filteredTemplates.length === 0 ? (
        <div className="panel p-6">
          <EmptyState description="No response templates match your search & filter criteria." />
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="panel p-4 flex flex-col justify-between space-y-3 hover:border-[#3f3f46] transition-colors"
            >
              {/* Card Header */}
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-foreground line-clamp-1">
                    {tpl.title}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      tpl.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {tpl.status}
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-background border border-border font-semibold text-blue-500">
                    {tpl.targetRating}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-background border border-border font-medium text-foreground">
                    {tpl.category}
                  </span>
                  <span className="text-muted-foreground tnum ml-auto">
                    {tpl.usageCount.toLocaleString()} uses
                  </span>
                </div>
              </div>

              {/* Template Content Box */}
              <div className="bg-background border border-border rounded-md p-3 text-xs text-foreground/90 font-mono leading-relaxed relative group">
                <p className="line-clamp-3">{tpl.content}</p>

                {/* Variable Pills */}
                <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-border">
                  {tpl.variables.map((v) => (
                    <span
                      key={v}
                      className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9.5px] font-sans font-medium"
                    >
                      {`{${v}}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopyText(tpl.content, tpl.id)}
                    className="h-7 px-2.5 rounded bg-background border border-border hover:border-blue-500/50 text-foreground text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedId === tpl.id ? (
                      <>
                        <Check className="size-3 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3 text-muted-foreground" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenPreview(tpl)}
                    className="h-7 px-2.5 rounded bg-background border border-border hover:border-blue-500/50 text-foreground text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Eye className="size-3 text-muted-foreground" />
                    <span>Test & Preview</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(tpl)}
                    className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(tpl.id)}
                    className="p-1.5 rounded hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="panel p-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-muted-foreground font-semibold">
                <th className="py-2.5 px-3">Template Title</th>
                <th className="py-2.5 px-3">Target Rating</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-center">Uses</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTemplates.map((tpl) => (
                <tr key={tpl.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-foreground">{tpl.title}</p>
                    <p className="text-[10px] text-muted-foreground line-clamp-1 truncate max-w-xs mt-0.5">
                      {tpl.content}
                    </p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-background border border-border font-semibold text-blue-500 text-[10px]">
                      {tpl.targetRating}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{tpl.category}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tpl.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                          : "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                      }`}
                    >
                      {tpl.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-semibold tnum text-foreground">
                    {tpl.usageCount}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleCopyText(tpl.content, tpl.id)}
                        className="px-2 py-1 rounded bg-background border border-border hover:border-blue-500/50 text-[10px] font-semibold cursor-pointer"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => handleOpenPreview(tpl)}
                        className="px-2 py-1 rounded bg-background border border-border hover:border-blue-500/50 text-[10px] font-semibold cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleOpenEdit(tpl)}
                        className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <Edit2 className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Template Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg bg-card dark:bg-[#121214] border-border text-foreground p-5 sm:p-6 shadow-2xl rounded-xl">
          <DialogHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-bold text-foreground">
              {editingTemplate ? "Edit Response Template" : "Create Response Template"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 my-3 text-xs">
            {/* Title */}
            <div className="space-y-1">
              <label className="font-semibold text-muted-foreground">Template Title</label>
              <input
                type="text"
                placeholder="e.g. 5-Star General Appreciation"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="h-8 w-full rounded bg-background border border-border px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Category & Target Rating */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Category</label>
                <Select
                  value={formCategory}
                  onValueChange={(v) => setFormCategory(v as ResponseTemplateItem["category"])}
                >
                  <SelectTrigger className="h-8 bg-background border-border text-foreground text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Pricing">Pricing</SelectItem>
                    <SelectItem value="Ambience">Ambience</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Target Rating</label>
                <Select
                  value={formRating}
                  onValueChange={(v) => setFormRating(v as ResponseTemplateItem["targetRating"])}
                >
                  <SelectTrigger className="h-8 bg-background border-border text-foreground text-xs">
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground text-xs">
                    <SelectItem value="5-Star">5-Star</SelectItem>
                    <SelectItem value="4-Star">4-Star</SelectItem>
                    <SelectItem value="3-Star">3-Star</SelectItem>
                    <SelectItem value="1-2 Star">1-2 Star Recovery</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Content Textarea */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-muted-foreground">Template Response Body</label>
                <span className="text-[10px] text-blue-500 italic">Use {`{Variable}`} tags</span>
              </div>
              <textarea
                rows={4}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full rounded bg-background border border-border p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
              className="h-8 border-border text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveTemplate}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-5 cursor-pointer"
            >
              {editingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test & Live Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-lg bg-card dark:bg-[#121214] border-border text-foreground p-5 sm:p-6 shadow-2xl rounded-xl">
          <DialogHeader className="border-b border-border pb-3 flex flex-row items-center justify-between">
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <Eye className="size-4 text-blue-500" />
              <span>Live Response Preview & Variable Test</span>
            </DialogTitle>
          </DialogHeader>

          {previewTemplate && (
            <div className="space-y-4 my-3 text-xs">
              <div className="p-3 rounded bg-secondary/40 border border-border space-y-1">
                <p className="text-[11px] font-bold text-blue-500">{previewTemplate.title}</p>
                <p className="text-[10px] text-muted-foreground font-mono">{previewTemplate.content}</p>
              </div>

              {/* Variable Input Test Fields */}
              <div className="space-y-2">
                <p className="font-semibold text-muted-foreground text-[11px]">Test Variable Values:</p>
                <div className="grid grid-cols-2 gap-2">
                  {previewTemplate.variables.map((varName) => (
                    <div key={varName} className="space-y-0.5">
                      <label className="text-[10px] text-blue-500 font-mono">{`{${varName}}`}</label>
                      <input
                        type="text"
                        value={variableInputs[varName] ?? ""}
                        onChange={(e) =>
                          setVariableInputs((prev) => ({ ...prev, [varName]: e.target.value }))
                        }
                        className="h-7 w-full rounded bg-background border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Compiled Output */}
              <div className="space-y-1">
                <p className="font-semibold text-emerald-500 text-[11px]">Compiled Final Response Output:</p>
                <div className="p-3 rounded bg-secondary/40 border border-emerald-500/30 text-xs text-foreground font-mono leading-relaxed">
                  {compiledPreviewText}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-border pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewModalOpen(false)}
              className="h-8 border-border text-xs font-semibold cursor-pointer"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(compiledPreviewText);
                toast.success("Final compiled response copied!");
              }}
              className="h-8 bg-blue-500 hover:bg-blue-600 text-black font-bold text-xs px-4 cursor-pointer gap-1"
            >
              <Copy className="size-3.5" />
              <span>Copy Final Response</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
