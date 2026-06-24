import React from 'react';
import {
  format,
  parse,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  addMonths,
  subMonths,
  startOfMonth as getStartOfMonth,
  endOfMonth as getEndOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale/es';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface DateRange {
  desde?: Date;
  hasta?: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

function parseDateInput(value: string): Date | null {
  if (!value || value.length !== 10) return null;
  const parsed = parse(value, 'dd/MM/yyyy', new Date());
  if (isNaN(parsed.getTime())) return null;
  return parsed;
}

function formatDateInput(date?: Date): string {
  if (!date) return '';
  return format(date, 'dd/MM/yyyy');
}

function toISODateString(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

function getPresets(): { label: string; getRange: () => DateRange }[] {
  return [
    {
      label: 'Hoy',
      getRange: () => ({
        desde: startOfDay(new Date()),
        hasta: endOfDay(new Date()),
      }),
    },
    {
      label: 'Esta Semana',
      getRange: () => ({
        desde: startOfDay(startOfWeek(new Date(), { weekStartsOn: 1 })),
        hasta: endOfDay(endOfWeek(new Date(), { weekStartsOn: 1 })),
      }),
    },
    {
      label: 'Este Mes',
      getRange: () => ({
        desde: startOfDay(getStartOfMonth(new Date())),
        hasta: endOfDay(getEndOfMonth(new Date())),
      }),
    },
    {
      label: 'Últimos 30 Días',
      getRange: () => ({
        desde: startOfDay(subDays(new Date(), 30)),
        hasta: endOfDay(new Date()),
      }),
    },
  ];
}

export function useDateRange() {
  const [fechaDesde, setFechaDesde] = React.useState<string | undefined>();
  const [fechaHasta, setFechaHasta] = React.useState<string | undefined>();

  const dateRange: DateRange = {
    desde: fechaDesde ? parseISOStrict(fechaDesde) : undefined,
    hasta: fechaHasta ? parseISOStrict(fechaHasta) : undefined,
  };

  const setRange = React.useCallback((range: DateRange) => {
    setFechaDesde(range.desde ? toISODateString(range.desde) : undefined);
    setFechaHasta(range.hasta ? toISODateString(range.hasta) : undefined);
  }, []);

  const clear = React.useCallback(() => {
    setFechaDesde(undefined);
    setFechaHasta(undefined);
  }, []);

  const hasActiveFilter = !!(fechaDesde && fechaHasta);

  return {
    fechaDesde,
    fechaHasta,
    dateRange,
    setRange,
    clear,
    hasActiveFilter,
  };
}

function parseISOStrict(s: string): Date {
  const d = new Date(s);
  return d;
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange>(value);
  const [desdeInput, setDesdeInput] = React.useState(formatDateInput(value.desde));
  const [hastaInput, setHastaInput] = React.useState(formatDateInput(value.hasta));
  const [viewMonth, setViewMonth] = React.useState(new Date());
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setTempRange(value);
    setDesdeInput(formatDateInput(value.desde));
    setHastaInput(formatDateInput(value.hasta));
  }, [value]);

  React.useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handlePreset = (getRange: () => DateRange) => {
    const range = getRange();
    setTempRange(range);
    setDesdeInput(formatDateInput(range.desde));
    setHastaInput(formatDateInput(range.hasta));
  };

  const handleDesdeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDesdeInput(val);
    const parsed = parseDateInput(val);
    if (parsed) {
      setTempRange(prev => ({ ...prev, desde: startOfDay(parsed) }));
    }
  };

  const handleHastaInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHastaInput(val);
    const parsed = parseDateInput(val);
    if (parsed) {
      setTempRange(prev => ({ ...prev, hasta: endOfDay(parsed) }));
    }
  };

  const handleDayClick = (day: Date) => {
    if (!tempRange.desde || (tempRange.desde && tempRange.hasta)) {
      setTempRange({ desde: startOfDay(day), hasta: undefined });
      setDesdeInput(formatDateInput(day));
      setHastaInput('');
    } else {
      if (isBefore(day, tempRange.desde)) {
        setTempRange({ desde: startOfDay(day), hasta: endOfDay(tempRange.desde) });
        setDesdeInput(formatDateInput(day));
        setHastaInput(formatDateInput(tempRange.desde));
      } else {
        setTempRange(prev => ({ ...prev, hasta: endOfDay(day) }));
        setHastaInput(formatDateInput(day));
      }
    }
  };

  const handleApply = () => {
    if (tempRange.desde && tempRange.hasta && isAfter(tempRange.desde, tempRange.hasta)) {
      setTempRange({ desde: tempRange.hasta, hasta: tempRange.desde });
      onChange({ desde: tempRange.hasta, hasta: tempRange.desde });
    } else {
      onChange(tempRange);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    const empty: DateRange = {};
    setTempRange(empty);
    setDesdeInput('');
    setHastaInput('');
    onChange(empty);
    setIsOpen(false);
  };

  const daysInMonth = eachDayOfInterval({
    start: getStartOfMonth(viewMonth),
    end: getEndOfMonth(viewMonth),
  });

  const startDayOfWeek = getStartOfMonth(viewMonth).getDay();
  const dayLabels = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  const hasActiveFilter = !!(value.desde && value.hasta);

  const triggerLabel = value.desde && value.hasta
    ? `${formatDateInput(value.desde)} - ${formatDateInput(value.hasta)}`
    : 'Filtrar por fecha';

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 text-sm rounded-full border transition-colors',
          hasActiveFilter
            ? 'bg-primary/10 text-primary border-primary/30'
            : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
        )}
      >
        <CalendarIcon size={16} />
        <span>{triggerLabel}</span>
        {hasActiveFilter && (
          <span className="size-1.5 rounded-full bg-primary" />
        )}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 z-50 w-[480px] bg-card border border-border rounded-xl p-5 space-y-4"
        >
          {/* Presets */}
          <div className="flex gap-2 flex-wrap">
            {getPresets().map(preset => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset.getRange)}
                className="px-3 py-1.5 text-xs font-semibold rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Date Inputs */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Desde</label>
              <input
                type="text"
                value={desdeInput}
                onChange={handleDesdeInputChange}
                placeholder="DD/MM/AAAA"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <span className="text-muted-foreground mt-6">→</span>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Hasta</label>
              <input
                type="text"
                value={hastaInput}
                onChange={handleHastaInputChange}
                placeholder="DD/MM/AAAA"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Calendar */}
          <div>
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setViewMonth(prev => subMonths(prev, 1))}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-semibold tracking-tight">
                {format(viewMonth, "MMMM 'del' yyyy", { locale: es })}
              </span>
              <button
                onClick={() => setViewMonth(prev => addMonths(prev, 1))}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 mb-1">
              {dayLabels.map(label => (
                <div key={label} className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider py-1">
                  {label}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: startDayOfWeek === 0 ? 6 : startDayOfWeek - 1 }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {daysInMonth.map(day => {
                const isSelected = tempRange.desde && isSameDay(day, tempRange.desde);
                const isSelectedEnd = tempRange.hasta && isSameDay(day, tempRange.hasta);
                const inRange = tempRange.desde && tempRange.hasta && isWithinInterval(day, { start: tempRange.desde, end: tempRange.hasta });
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      'relative text-sm py-1.5 rounded-lg transition-colors',
                      isSelected || isSelectedEnd
                        ? 'bg-primary text-primary-foreground font-semibold'
                        : inRange
                        ? 'bg-primary/10 text-foreground'
                        : isToday
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground hover:bg-muted',
                      'hover:z-10'
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
              Limpiar filtro
            </button>
            <button
              onClick={handleApply}
              disabled={!tempRange.desde || !tempRange.hasta}
              className="px-4 py-2 text-xs font-bold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
