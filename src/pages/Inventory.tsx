import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MobileHeader from "@/components/layout/MobileHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockInventory, mockEmployees, mockDiscounts } from "@/data/mobileMockData";
import { Plus, Search, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LowInventoryAlertModal from "@/components/modals/LowInventoryAlertModal";
import StockAdjustmentModal from "@/components/modals/StockAdjustmentModal";
import AddAgreementInventoryModal from "@/components/modals/AddAgreementInventoryModal";
import AssignEmployeeModal from "@/components/modals/AssignEmployeeModal";
import AddNoteModal from "@/components/modals/AddNoteModal";
import AddEquipmentModal from "@/components/modals/AddEquipmentModal";
import UpdateEquipmentModal from "@/components/modals/UpdateEquipmentModal";
import ManageDiscountModal from "@/components/modals/ManageDiscountModal";
import AddDiscountModal from "@/components/modals/AddDiscountModal";
import EditDiscountModal from "@/components/modals/EditDiscountModal";
import SendCurrentReportModal from "@/components/modals/SendCurrentReportModal";
import SendStockInOutReportModal from "@/components/modals/SendStockInOutReportModal";
import { toast } from "sonner";

const Inventory = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("inventory-services");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [equipmentMenuOpenId, setEquipmentMenuOpenId] = useState<string | null>(null);
  const [assignEmployeeModalOpen, setAssignEmployeeModalOpen] = useState(false);
  const [selectedEquipmentForAssign, setSelectedEquipmentForAssign] = useState<{ id: string; currentEmployeeId: string | null } | null>(null);
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [selectedEquipmentForNote, setSelectedEquipmentForNote] = useState<string | null>(null);
  const [addEquipmentModalOpen, setAddEquipmentModalOpen] = useState(false);
  const [updateEquipmentModalOpen, setUpdateEquipmentModalOpen] = useState(false);
  const [selectedEquipmentForUpdate, setSelectedEquipmentForUpdate] = useState<{ id: string; inventoryName: string; serialNumber: string } | null>(null);
  const [manageDiscountModalOpen, setManageDiscountModalOpen] = useState(false);
  const [addDiscountModalOpen, setAddDiscountModalOpen] = useState(false);
  const [editDiscountModalOpen, setEditDiscountModalOpen] = useState(false);
  const [selectedDiscountForEdit, setSelectedDiscountForEdit] = useState<{
    id: string;
    name: string;
    value: number;
    type: "%" | "$";
    startDate: string;
    endDate: string;
    active: boolean;
    usageCount: number;
  } | null>(null);
  const [sendCurrentReportModalOpen, setSendCurrentReportModalOpen] = useState(false);
  const [sendStockInOutReportModalOpen, setSendStockInOutReportModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [lowAlertModalOpen, setLowAlertModalOpen] = useState(false);
  const [selectedItemForAlert, setSelectedItemForAlert] = useState<{ id: string; threshold?: number } | null>(null);
  const [stockAdjustmentModalOpen, setStockAdjustmentModalOpen] = useState(false);
  const [selectedItemForAdjustment, setSelectedItemForAdjustment] = useState<{ id: string; name: string; sku: string; stock: number } | null>(null);
  const [stockAdjustmentDefaults, setStockAdjustmentDefaults] = useState<{
    transactionType?: "stock-in" | "stock-out";
    adjustmentReason?: string;
    remarks?: string;
    adjustBy?: string;
  } | null>(null);
  const [addAgreementInventoryModalOpen, setAddAgreementInventoryModalOpen] = useState(false);
  
  // Mock agreement inventory data
  const [agreementInventory, setAgreementInventory] = useState([
    { id: "AGR-INV-001", inventoryId: "INV-ITEM-001", name: "HVAC Filter - Standard" },
    { id: "AGR-INV-002", inventoryId: "INV-ITEM-004", name: "Thermostat - Programmable" },
    { id: "AGR-INV-003", inventoryId: "INV-ITEM-010", name: "Air Filter - MERV 13" },
    { id: "AGR-INV-004", inventoryId: "INV-ITEM-016", name: "Condensate Pump" },
  ]);
  
  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.sku.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const filteredAgreementInventory = agreementInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.inventoryId.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleDeleteAgreementInventory = (id: string) => {
    setAgreementInventory(agreementInventory.filter(item => item.id !== id));
    toast.success("Item removed from agreement inventory");
  };

  // Filter variable inventory for agreement inventory modal
  const variableInventory = mockInventory.filter(item => item.type === "V");

  const handleAddAgreementInventory = (inventoryId: string) => {
    const selectedItem = mockInventory.find(item => item.id === inventoryId);
    if (selectedItem) {
      const newId = `AGR-INV-${String(agreementInventory.length + 1).padStart(3, '0')}`;
      setAgreementInventory([
        ...agreementInventory,
        { id: newId, inventoryId: selectedItem.id, name: selectedItem.name }
      ]);
      toast.success("Inventory added to agreement successfully");
      setAddAgreementInventoryModalOpen(false);
    }
  };

  const handleAddButtonClick = () => {
    if (activeTab === "agreement-inventory") {
      setAddAgreementInventoryModalOpen(true);
    } else if (activeTab === "equipment-tracking") {
      setAddEquipmentModalOpen(true);
    } else {
      navigate("/inventory/new");
    }
  };

  // Mock equipment notes data
  const [equipmentNotes, setEquipmentNotes] = useState<Record<string, Array<{
    id: string;
    text: string;
    author: string;
    date: string;
  }>>>({
    "EQ-001": [
      {
        id: "note-1",
        text: "Replaced damaged cable.",
        author: "James Miller",
        date: "2025-11-08",
      },
      {
        id: "note-2",
        text: "Checked calibration and functionality.",
        author: "Sarah Kim",
        date: "2025-11-03",
      },
    ],
    "EQ-002": [
      {
        id: "note-3",
        text: "Routine maintenance completed.",
        author: "Mike Johnson",
        date: "2025-11-05",
      },
    ],
  });

  // Mock equipment tracking data (using state to allow updates)
  const [equipmentTracking, setEquipmentTracking] = useState([
    {
      id: "EQ-001",
      serialNumber: "SN-0001",
      inventoryName: "HVAC Diagnostic Tool",
      employeeId: "1",
      employeeName: "Mike Johnson",
      status: "Assigned" as const,
    },
    {
      id: "EQ-002",
      serialNumber: "SN-0002",
      inventoryName: "Electrical Multimeter",
      employeeId: "3",
      employeeName: "Chris Davis",
      status: "Assigned" as const,
    },
    {
      id: "EQ-003",
      serialNumber: "SN-0003",
      inventoryName: "Pipe Inspection Camera",
      employeeId: "2",
      employeeName: "Tom Wilson",
      status: "Assigned" as const,
    },
    {
      id: "EQ-004",
      serialNumber: "SN-0004",
      inventoryName: "Pressure Gauge Set",
      employeeId: null,
      employeeName: null,
      status: "Unassigned" as const,
    },
    {
      id: "EQ-005",
      serialNumber: "SN-0005",
      inventoryName: "Refrigerant Leak Detector",
      employeeId: "1",
      employeeName: "Mike Johnson",
      status: "Assigned" as const,
    },
  ]);

  // Filter equipment tracking data
  const filteredEquipmentTracking = equipmentTracking.filter((equipment) => {
    const matchesSearch = equipment.inventoryName.toLowerCase().includes(search.toLowerCase()) ||
                         equipment.serialNumber.toLowerCase().includes(search.toLowerCase());
    const matchesEmployee = selectedEmployee === "all" || equipment.employeeId === selectedEmployee;
    return matchesSearch && matchesEmployee;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <MobileHeader 
        title="Inventory"
      />
      
      <div className="flex-1 overflow-y-auto scrollable px-4 pb-6" style={{ paddingTop: 'calc(3.5rem + env(safe-area-inset-top) + 0.5rem)' }}>
        {/* Action Buttons */}
        <div className="flex justify-between gap-2 mt-2 mb-3">
          <button
            onClick={() => {
              setSendCurrentReportModalOpen(true);
            }}
            className="flex-1 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition"
          >
            Current Report
          </button>
          <button
            onClick={() => {
              setSendStockInOutReportModalOpen(true);
            }}
            className="flex-1 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition"
          >
            Stock In/Out Report
          </button>
          <button
            onClick={() => {
              setManageDiscountModalOpen(true);
            }}
            className="flex-1 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition"
          >
            Discount
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-gray-200 mb-2">
          <button
            onClick={() => setActiveTab("inventory-services")}
            className={cn(
              "flex-1 py-2 text-center text-sm font-medium transition-colors",
              activeTab === "inventory-services"
                ? "text-orange-600 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-orange-600"
            )}
          >
            Inventory / Services
          </button>
          <button
            onClick={() => setActiveTab("agreement-inventory")}
            className={cn(
              "flex-1 py-2 text-center text-sm font-medium transition-colors",
              activeTab === "agreement-inventory"
                ? "text-orange-600 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-orange-600"
            )}
          >
            Agreement Inventory
          </button>
          <button
            onClick={() => setActiveTab("equipment-tracking")}
            className={cn(
              "flex-1 py-2 text-center text-sm font-medium transition-colors",
              activeTab === "equipment-tracking"
                ? "text-orange-600 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-orange-600"
            )}
          >
            Equipment Tracking
          </button>
        </div>

        {/* Employee Filter - Only for Equipment Tracking */}
        {activeTab === "equipment-tracking" && (
          <div className="mb-2">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500">
                <SelectValue placeholder="Filter by employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {mockEmployees
                  .filter(emp => emp.status === "Active")
                  .map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Add Button and Search - Same Row */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
            <Button
              size="sm"
            onClick={handleAddButtonClick}
            className="bg-orange-500 hover:bg-orange-600 text-white shrink-0"
            >
            <Plus className="h-4 w-4" />
            </Button>
        </div>
        
        {/* Inventory Cards */}
        <div className="space-y-2 pt-2">
          {activeTab === "inventory-services" && filteredInventory.map(item => {
            const isMenuOpen = openMenuId === item.id;
            
            return (
              <div
                key={item.id}
                className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-2 flex justify-between items-start"
              >
                <div className="flex flex-col flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">{item.sku}</h3>
                  <p className="text-base font-medium text-gray-800 mt-1">
                    {item.name}
                    {item.type && (
                      <span className="text-gray-500 font-normal ml-1">({item.type})</span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="text-green-600 font-semibold">Stock: {item.stock}</span>
                    <span className="text-gray-500">Low Alert: {item.lowStockThreshold}</span>
                  </div>
                  {item.type !== "V" && item.unitPrice !== undefined && (
                    <p className="text-orange-600 font-semibold text-sm mt-1">${item.unitPrice.toFixed(2)}</p>
                  )}
                </div>
                
                {/* Quick Action Menu Trigger */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(isMenuOpen ? null : item.id);
                    }}
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                        <ul className="text-sm text-gray-700">
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              navigate(`/inventory/${item.id}/edit`);
                            }}
                          >
                            Edit Inventory
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              setSelectedItemForAdjustment({
                                id: item.id,
                                name: item.name,
                                sku: item.sku,
                                stock: item.stock,
                              });
                              setStockAdjustmentModalOpen(true);
                            }}
                          >
                            Adjust Stock
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              setSelectedItemForAlert({ id: item.id, threshold: item.lowStockThreshold });
                              setLowAlertModalOpen(true);
                            }}
                          >
                            Add Low Inventory Alert
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              setSelectedItemForAdjustment({
                                id: item.id,
                                name: item.name,
                                sku: item.sku,
                                stock: item.stock,
                              });
                              setStockAdjustmentDefaults({
                                transactionType: "stock-out",
                                adjustmentReason: "Marked as Damaged",
                                remarks: "Item marked as damaged goods",
                              });
                              setStockAdjustmentModalOpen(true);
                            }}
                          >
                            Add to Damage Goods
                          </li>
                          <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              setSelectedItemForAdjustment({
                                id: item.id,
                                name: item.name,
                                sku: item.sku,
                                stock: item.stock,
                              });
                              setStockAdjustmentDefaults({
                                transactionType: "stock-out",
                                adjustmentReason: "Marked as Demo Units",
                                remarks: "Item marked as tester/demo unit",
                              });
                              setStockAdjustmentModalOpen(true);
                            }}
                          >
                            Add to Tester Item
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Agreement Inventory Tab */}
          {activeTab === "agreement-inventory" && (
            <div className="space-y-2 pt-2">
              {filteredAgreementInventory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No items available for Agreement Inventory</p>
                </div>
              ) : (
                filteredAgreementInventory.map(item => (
                  <div
                    key={item.id}
                    className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-2 flex justify-between items-center"
                  >
                    <div className="flex flex-col flex-1">
                      <p className="text-xs text-gray-500">{item.inventoryId}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.name}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteAgreementInventory(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Equipment Tracking Tab */}
          {activeTab === "equipment-tracking" && (
            <div className="space-y-2 pt-2">
              {filteredEquipmentTracking.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No equipment tracking data available</p>
                  {selectedEmployee !== "all" && (
                    <p className="text-xs mt-1">
                      Filtered by: {mockEmployees.find(emp => emp.id === selectedEmployee)?.name || "Unknown"}
                    </p>
                  )}
                </div>
              ) : (
                filteredEquipmentTracking.map((equipment) => {
                  const isMenuOpen = equipmentMenuOpenId === equipment.id;
                  return (
                    <div
                      key={equipment.id}
                      className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 mb-2"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col flex-1">
                          <p className="text-sm font-semibold text-gray-800">{equipment.serialNumber}</p>
                          <p className="text-base text-gray-700 mt-0.5">{equipment.inventoryName}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Employee:{" "}
                            <span className="font-medium text-gray-800">
                              {equipment.employeeName || "None"}
                            </span>
                          </p>
                        </div>

                        {/* Status Badge and Quick Action Menu */}
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-xs font-medium px-2 py-1 rounded-full shrink-0",
                              equipment.status === "Assigned"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            )}
                          >
                            {equipment.status}
                          </span>

                          {/* Quick Action Menu */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEquipmentMenuOpenId(isMenuOpen ? null : equipment.id);
                              }}
                              className="text-gray-500 hover:text-gray-700 p-1"
                            >
                              <MoreVertical className="h-5 w-5" />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setEquipmentMenuOpenId(null)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                  <ul className="text-sm text-gray-700">
                                    <li
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEquipmentMenuOpenId(null);
                                        setSelectedEquipmentForAssign({
                                          id: equipment.id,
                                          currentEmployeeId: equipment.employeeId,
                                        });
                                        setAssignEmployeeModalOpen(true);
                                      }}
                                    >
                                      Assign / Reassign Employee
                                    </li>
                                    <li
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEquipmentMenuOpenId(null);
                                        setSelectedEquipmentForNote(equipment.id);
                                        setAddNoteModalOpen(true);
                                      }}
                                    >
                                      Add / View Note
                                    </li>
                                    <li
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEquipmentMenuOpenId(null);
                                        setSelectedEquipmentForUpdate({
                                          id: equipment.id,
                                          inventoryName: equipment.inventoryName,
                                          serialNumber: equipment.serialNumber,
                                        });
                                        setUpdateEquipmentModalOpen(true);
                                      }}
                                    >
                                      Update Equipment
                                    </li>
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Low Inventory Alert Modal */}
      <LowInventoryAlertModal
        open={lowAlertModalOpen}
        onClose={() => {
          setLowAlertModalOpen(false);
          setSelectedItemForAlert(null);
        }}
        itemId={selectedItemForAlert?.id || null}
        currentThreshold={selectedItemForAlert?.threshold}
        onSave={(itemId, threshold) => {
          // In real app, this would call an API: PUT /api/inventory/:id/alert-threshold
          console.info("Updating low inventory alert threshold", itemId, threshold);
          toast.success("Low inventory alert updated successfully");
          setLowAlertModalOpen(false);
          setSelectedItemForAlert(null);
        }}
      />

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        open={stockAdjustmentModalOpen}
        onClose={() => {
          setStockAdjustmentModalOpen(false);
          setSelectedItemForAdjustment(null);
          setStockAdjustmentDefaults(null);
        }}
        item={selectedItemForAdjustment}
        initialTransactionType={stockAdjustmentDefaults?.transactionType}
        initialAdjustmentReason={stockAdjustmentDefaults?.adjustmentReason}
        initialRemarks={stockAdjustmentDefaults?.remarks}
        initialAdjustBy={stockAdjustmentDefaults?.adjustBy}
        onSave={(itemId, adjustment, transactionType, reason, remarks) => {
          // In real app, this would call an API: POST /api/inventory/:id/adjust-stock
          console.info("Saving stock adjustment", {
            itemId,
            adjustment,
            transactionType,
            reason,
            remarks,
          });
          toast.success("Stock adjustment saved successfully");
          setStockAdjustmentModalOpen(false);
          setSelectedItemForAdjustment(null);
          setStockAdjustmentDefaults(null);
        }}
      />

      {/* Add Agreement Inventory Modal */}
      <AddAgreementInventoryModal
        open={addAgreementInventoryModalOpen}
        onClose={() => setAddAgreementInventoryModalOpen(false)}
        availableInventory={variableInventory.map(item => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
        }))}
        onAdd={handleAddAgreementInventory}
      />

      {/* Assign Employee Modal */}
      <AssignEmployeeModal
        open={assignEmployeeModalOpen}
        onClose={() => {
          setAssignEmployeeModalOpen(false);
          setSelectedEquipmentForAssign(null);
        }}
        equipmentId={selectedEquipmentForAssign?.id || null}
        currentEmployeeId={selectedEquipmentForAssign?.currentEmployeeId || null}
        availableEmployees={mockEmployees
          .filter(emp => emp.status === "Active")
          .map(emp => ({
            id: emp.id,
            name: emp.name,
          }))}
        onSave={(equipmentId, employeeId) => {
          // Update equipment tracking data
          setEquipmentTracking(equipmentTracking.map(equipment => {
            if (equipment.id === equipmentId) {
              const employee = employeeId ? mockEmployees.find(emp => emp.id === employeeId) : null;
              return {
                ...equipment,
                employeeId: employeeId,
                employeeName: employee?.name || null,
                status: employeeId ? ("Assigned" as const) : ("Unassigned" as const),
              };
            }
            return equipment;
          }));
          toast.success("Employee assigned successfully");
          setAssignEmployeeModalOpen(false);
          setSelectedEquipmentForAssign(null);
        }}
      />

      {/* Add Note Modal */}
      <AddNoteModal
        open={addNoteModalOpen}
        onClose={() => {
          setAddNoteModalOpen(false);
          setSelectedEquipmentForNote(null);
        }}
        equipmentId={selectedEquipmentForNote}
        existingNotes={selectedEquipmentForNote ? equipmentNotes[selectedEquipmentForNote] || [] : []}
        onSave={(equipmentId, noteText) => {
          // Add new note to equipment notes
          const newNote = {
            id: `note-${Date.now()}`,
            text: noteText,
            author: "Current User", // In real app, this would be the logged-in user
            date: new Date().toISOString().split("T")[0],
          };

          setEquipmentNotes({
            ...equipmentNotes,
            [equipmentId]: [
              newNote,
              ...(equipmentNotes[equipmentId] || []),
            ],
          });

          toast.success("Note added successfully");
          setAddNoteModalOpen(false);
          setSelectedEquipmentForNote(null);
        }}
      />

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        open={addEquipmentModalOpen}
        onClose={() => setAddEquipmentModalOpen(false)}
        availableInventory={mockInventory.map(item => ({
          id: item.id,
          name: item.name,
        }))}
        onSave={(inventoryId, serialNumber) => {
          // Add new equipment to tracking
          const selectedInventory = mockInventory.find(item => item.id === inventoryId);
          if (selectedInventory) {
            const newEquipment = {
              id: `EQ-${String(equipmentTracking.length + 1).padStart(3, '0')}`,
              serialNumber: serialNumber,
              inventoryName: selectedInventory.name,
              employeeId: null,
              employeeName: null,
              status: "Unassigned" as const,
            };
            setEquipmentTracking([...equipmentTracking, newEquipment]);
            toast.success("Equipment added successfully");
            setAddEquipmentModalOpen(false);
          }
        }}
      />

      {/* Update Equipment Modal */}
      <UpdateEquipmentModal
        open={updateEquipmentModalOpen}
        onClose={() => {
          setUpdateEquipmentModalOpen(false);
          setSelectedEquipmentForUpdate(null);
        }}
        equipment={selectedEquipmentForUpdate}
        availableInventory={mockInventory.map(item => ({
          id: item.id,
          name: item.name,
        }))}
        onUpdate={(equipmentId, inventoryId, serialNumber) => {
          // Update equipment in tracking
          const selectedInventory = mockInventory.find(item => item.id === inventoryId);
          if (selectedInventory) {
            setEquipmentTracking(equipmentTracking.map(equipment => {
              if (equipment.id === equipmentId) {
                return {
                  ...equipment,
                  inventoryName: selectedInventory.name,
                  serialNumber: serialNumber,
                };
              }
              return equipment;
            }));
            toast.success("Equipment updated successfully");
            setUpdateEquipmentModalOpen(false);
            setSelectedEquipmentForUpdate(null);
          }
        }}
      />

      {/* Manage Discount Modal */}
      <ManageDiscountModal
        open={manageDiscountModalOpen && !addDiscountModalOpen && !editDiscountModalOpen}
        onClose={() => setManageDiscountModalOpen(false)}
        discounts={mockDiscounts}
        onAdd={() => {
          setAddDiscountModalOpen(true);
        }}
        onEdit={(discount) => {
          setSelectedDiscountForEdit(discount);
          setEditDiscountModalOpen(true);
        }}
        onDelete={(discountId) => {
          toast.info(`Delete discount ${discountId} - to be implemented`);
        }}
      />

      {/* Add Discount Modal */}
      <AddDiscountModal
        open={addDiscountModalOpen}
        onClose={() => setAddDiscountModalOpen(false)}
        onBack={() => {
          setAddDiscountModalOpen(false);
          setManageDiscountModalOpen(true);
        }}
        onAdd={(discount) => {
          // In a real app, this would call an API to add the discount
          console.info("Adding discount:", discount);
          toast.success("Discount added successfully");
          setAddDiscountModalOpen(false);
          setManageDiscountModalOpen(true);
        }}
      />

      {/* Edit Discount Modal */}
      <EditDiscountModal
        open={editDiscountModalOpen}
        onClose={() => {
          setEditDiscountModalOpen(false);
          setSelectedDiscountForEdit(null);
        }}
        discount={selectedDiscountForEdit}
        onBack={() => {
          setEditDiscountModalOpen(false);
          setSelectedDiscountForEdit(null);
          setManageDiscountModalOpen(true);
        }}
        onUpdate={(discountId, discount) => {
          // In a real app, this would call an API to update the discount
          console.info("Updating discount:", discountId, discount);
          toast.success("Discount updated successfully");
          setEditDiscountModalOpen(false);
          setSelectedDiscountForEdit(null);
          setManageDiscountModalOpen(true);
        }}
      />

      {/* Send Current Report Modal */}
      <SendCurrentReportModal
        open={sendCurrentReportModalOpen}
        onClose={() => setSendCurrentReportModalOpen(false)}
        onSend={(data) => {
          // In a real app, this would call an API to send the report
          console.info("Sending current report:", data);
          toast.success("Report sent successfully");
          setSendCurrentReportModalOpen(false);
        }}
      />

      {/* Send Stock In/Out Report Modal */}
      <SendStockInOutReportModal
        open={sendStockInOutReportModalOpen}
        onClose={() => setSendStockInOutReportModalOpen(false)}
        onSend={(data) => {
          // In a real app, this would call an API to send the report
          console.info("Sending stock in/out report:", data);
          toast.success("Report sent successfully");
          setSendStockInOutReportModalOpen(false);
        }}
      />
    </div>
  );
};

export default Inventory;
