// src/pages/Setup/Rooms.tsx
import { useCallback, useEffect, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  DoorOpen, Plus, Search, Users, Monitor, FlaskConical, Edit3, Trash2, RefreshCw,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  roomService,
  type RoomRecord,
  type RoomPayload,
} from '@/services/roomService'

/* Neumorphic hairline seams. */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'
const SEAM_T = 'shadow-[0_-1px_0_var(--neu-shadow-dark)]'
const SEAM_Y = 'shadow-[0_-1px_0_var(--neu-shadow-dark),0_1px_0_var(--neu-shadow-dark)]'

const inputBase =
  'w-full px-3.5 py-2 rounded-xl text-xs text-fg focus:outline-none focus:ring-2 focus:ring-brand-500'
const labelBase = 'block text-xs font-semibold text-fg-muted mb-1'

interface RoomItem {
  id: string
  name: string
  code: string
  building: string
  floor: string
  type: RoomRecord['type']
  capacity: number
  amenities: string[]
  status: RoomRecord['status']
  currentClass?: string
}

const DEFAULT_FORM = {
  name: '',
  code: '',
  building: 'Main Academic Hall',
  floor: '1st Floor',
  type: 'Classroom' as RoomRecord['type'],
  capacity: 30,
  amenitiesText: 'Interactive Smartboard, AC',
}

function toRoomItem(room: RoomRecord): RoomItem {
  return {
    id: room.id,
    name: room.name,
    code: room.code,
    building: room.building,
    floor: room.floor,
    type: room.type,
    capacity: room.capacity,
    amenities: Array.isArray(room.amenities) ? room.amenities : [],
    status: room.status,
    currentClass: room.currentClass ?? undefined,
  }
}

export default function Rooms() {
  const { showToast } = useToast()

  const [rooms, setRooms] = useState<RoomItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<RoomItem | null>(null)
  const [formData, setFormData] = useState({ ...DEFAULT_FORM })
  const [saving, setSaving] = useState(false)

  const loadRooms = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const records = await roomService.list()
      setRooms(Array.isArray(records) ? records.map(toRoomItem) : [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setRooms([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadRooms() }, [loadRooms])

  const roomKpiCards: StatCard[] = [
    { id: 'total-rooms',     label: 'Total Rooms & Facilities', value: String(rooms.length),                                           delta: '-', deltaDirection: 'neutral', deltaLabel: 'campus spaces',   icon: 'School',   tint: 'blue' },
    { id: 'available-rooms', label: 'Available Spaces',         value: String(rooms.filter((r) => r.status === 'Available').length), delta: '-', deltaDirection: 'neutral', deltaLabel: 'ready to assign', icon: 'DoorOpen', tint: 'green' },
    { id: 'occupied-rooms',  label: 'Occupied Spaces',          value: String(rooms.filter((r) => r.status === 'Occupied').length),  delta: '-', deltaDirection: 'neutral', deltaLabel: 'in active use',   icon: 'Users',    tint: 'amber' },
    { id: 'total-capacity',  label: 'Total Seating Capacity',   value: rooms.reduce((sum, r) => sum + r.capacity, 0).toLocaleString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'available seats', icon: 'BookOpen', tint: 'violet' },
  ]

  const filteredRooms = rooms.filter((r) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q) ||
      r.building.toLowerCase().includes(q)
    const matchesType = typeFilter === 'All' || r.type === typeFilter
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const resetForm = () => { setFormData({ ...DEFAULT_FORM }); setEditingRoom(null) }

  const handleOpenCreate = () => { resetForm(); setModalOpen(true) }

  const handleOpenEdit = (room: RoomItem) => {
    setEditingRoom(room)
    setFormData({
      name: room.name,
      code: room.code,
      building: room.building,
      floor: room.floor,
      type: room.type,
      capacity: room.capacity,
      amenitiesText: room.amenities.join(', '),
    })
    setModalOpen(true)
  }

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast('Room name and code are required', 'error'); return
    }
    const payload: RoomPayload = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      building: formData.building.trim(),
      floor: formData.floor.trim(),
      type: formData.type,
      capacity: Number(formData.capacity) || 30,
      amenities: formData.amenitiesText.split(',').map((s) => s.trim()).filter(Boolean),
    }
    setSaving(true)
    try {
      if (editingRoom) {
        await roomService.update(editingRoom.id, payload)
        showToast('Room updated', 'success')
      } else {
        await roomService.create(payload)
        showToast('Room created', 'success')
      }
      setModalOpen(false)
      resetForm()
      await loadRooms()
    } catch {
      showToast('Failed to save room', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRoom = async (room: RoomItem) => {
    if (!window.confirm(`Delete room "${room.name}"?`)) return
    try {
      await roomService.delete(room.id)
      setRooms((prev) => prev.filter((r) => r.id !== room.id))
      showToast('Room deleted', 'success')
    } catch {
      showToast('Failed to delete room', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Rooms & Facilities"
          subtitle="Campus classrooms, science labs, tech workshops, and seating capacities."
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl theme-button-primary text-xs font-semibold shrink-0 cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Room</span>
        </button>
      </div>

      <StatsGrid cards={roomKpiCards} columns={4} />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-fg-muted z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search room name, code, or building..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl text-fg placeholder:text-fg-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="All">All types</option>
            <option value="Classroom">Classroom</option>
            <option value="Science Lab">Science Lab</option>
            <option value="Computer Lab">Computer Lab</option>
            <option value="Auditorium">Auditorium</option>
            <option value="Library Wing">Library Wing</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="All">All statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-fg-muted text-sm rounded-2xl glass-sm">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading rooms...
        </div>
      ) : error ? (
        <div className="py-16 text-center rounded-2xl glass-sm">
          <p className="text-sm font-bold text-error">Couldn't load rooms</p>
          <p className="mt-1 text-xs text-fg-muted">{error.message}</p>
          <button
            onClick={loadRooms}
            className="mt-3 rounded-xl bg-error px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-sm">
          <DoorOpen className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
          <p className="text-sm font-semibold text-fg">
            {rooms.length === 0 ? 'No rooms configured yet' : 'No matches'}
          </p>
          <p className="text-xs text-fg-muted mt-1">
            {rooms.length === 0
              ? 'Click "Add New Room" to create the first facility.'
              : 'Try a different search or filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl p-5 glass-sm flex flex-col justify-between hover:shadow-(--glass-strong-shadow) transition-shadow duration-300"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-400 shadow-sunken">
                      {room.type === 'Science Lab' ? (
                        <FlaskConical size={20} />
                      ) : room.type === 'Computer Lab' ? (
                        <Monitor size={20} />
                      ) : (
                        <DoorOpen size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-fg">{room.name}</h3>
                      <div className="text-xs text-fg-muted font-mono">
                        {room.code} • {room.building} ({room.floor})
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      room.status === 'Available'
                        ? 'bg-success/15 text-success'
                        : room.status === 'Occupied'
                          ? 'bg-warning/15 text-warning'
                          : 'bg-error/15 text-error'
                    }`}
                  >
                    {room.status}
                  </span>
                </div>

                {room.currentClass && (
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-warning/15 text-xs text-warning flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    <span>Current: <strong>{room.currentClass}</strong></span>
                  </div>
                )}

                {/* Info strip: top & bottom shadow seams */}
                <div className={`space-y-2 py-3 ${SEAM_Y} text-xs`}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-fg-muted">
                      <Users size={13} /> Seating capacity
                    </span>
                    <span className="font-bold text-fg">{room.capacity} seats</span>
                  </div>

                  {room.amenities.length > 0 && (
                    <div>
                      <div className="text-fg-muted mb-1">Amenities</div>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((a, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium text-fg-muted shadow-sunken"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-fg-muted uppercase tracking-wider">
                  {room.type}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(room)}
                    className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition cursor-pointer"
                    title="Edit room"
                    aria-label={`Edit ${room.name}`}
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteRoom(room)}
                    className="p-1.5 rounded-lg text-fg-muted hover:text-error hover:shadow-sunken transition cursor-pointer"
                    title={`Delete ${room.name}`}
                    aria-label={`Delete ${room.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 theme-overlay backdrop-blur-sm animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) { setModalOpen(false); resetForm() } }}
        >
          <div className="w-full max-w-md rounded-2xl glass-strong p-6 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <h3 className="text-lg font-bold text-fg mb-4">
              {editingRoom ? 'Edit Room / Lab' : 'Add New Room / Lab'}
            </h3>
            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div>
                <label className={labelBase}>Room name *</label>
                <input type="text" required placeholder="e.g. Physics Lab 303"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputBase} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}>Room code *</label>
                  <input type="text" required placeholder="e.g. LAB-PHY"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomRecord['type'] })}
                    className={`${inputBase} cursor-pointer`}
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Science Lab">Science Lab</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Auditorium">Auditorium</option>
                    <option value="Library Wing">Library Wing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelBase}>Building</label>
                  <input type="text" required value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Floor</label>
                  <input type="text" required value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className={inputBase} />
                </div>
                <div>
                  <label className={labelBase}>Capacity</label>
                  <input type="number" required min={1} max={2000}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className={inputBase} />
                </div>
              </div>

              <div>
                <label className={labelBase}>Amenities (comma separated)</label>
                <input type="text"
                  value={formData.amenitiesText}
                  onChange={(e) => setFormData({ ...formData, amenitiesText: e.target.value })}
                  className={inputBase} />
              </div>

              <div className={`flex items-center justify-end gap-3 pt-3 ${SEAM_T}`}>
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); resetForm() }}
                  className="glass-sm glass-interactive px-4 py-2 rounded-xl text-xs font-semibold text-fg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold theme-button-primary disabled:opacity-50 cursor-pointer"
                >
                  {editingRoom ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}