import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface DepartureTimesModalProps {
  open: boolean;
  initialTimes: string[]; // hh:mm:ss 배열
  onClose: () => void;
  onSave: (times: string[]) => void; // hh:mm:ss 배열
}

export default function DepartureTimesModal({ open, initialTimes, onClose, onSave }: DepartureTimesModalProps) {
  // times는 hh:mm 배열로 관리
  const [times, setTimes] = useState<string[]>([]);
  const [newHour, setNewHour] = useState(8);
  const [newMinute, setNewMinute] = useState(0);

  // initialTimes가 바뀔 때마다 hh:mm로 변환해서 세팅
  useEffect(() => {
    setTimes(initialTimes.map(t => t.slice(0, 5)));
  }, [initialTimes]);

  function addTime() {
    const h = newHour.toString().padStart(2, "0");
    const m = newMinute.toString().padStart(2, "0");
    const time = `${h}:${m}`;
    if (!times.includes(time)) {
      setTimes([...times, time].sort());
    }
  }

  function removeTime(idx: number) {
    setTimes(times.filter((_, i) => i !== idx));
  }

  function handleSave() {
    // hh:mm -> hh:mm:ss로 변환해서 onSave에 전달
    onSave(times.map(t => t + ":00"));
    onClose();
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 mb-4">
                  출발 시간표 수정
                </Dialog.Title>
                <div className="space-y-4">
                  <div>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min={0}
                        max={23}
                        value={newHour}
                        onChange={e => setNewHour(Math.max(0, Math.min(23, Number(e.target.value))))}
                        className="w-16 px-2 py-1 border rounded text-center"
                        aria-label="시"
                      />
                      <span>:</span>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={newMinute}
                        onChange={e => setNewMinute(Math.max(0, Math.min(59, Number(e.target.value))))}
                        className="w-16 px-2 py-1 border rounded text-center"
                        aria-label="분"
                      />
                      <button
                        type="button"
                        onClick={addTime}
                        className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        추가
                      </button>
                    </div>
                  </div>
                  <div>
                    {times.length === 0 ? (
                      <div className="text-gray-400 text-center py-4">등록된 시간이 없습니다</div>
                    ) : (
                      <ul className="grid grid-cols-3 gap-2">
                        {times.map((time, idx) => (
                          <li key={time} className="flex items-center bg-indigo-100 rounded px-2 py-1 justify-between">
                            <span className="text-indigo-800 font-medium">{time}</span>
                            <button
                              type="button"
                              onClick={() => removeTime(idx)}
                              className="ml-2 text-red-500 hover:text-red-700"
                              aria-label="삭제"
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex gap-2 justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={onClose}
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-semibold"
                    onClick={handleSave}
                  >
                    저장
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 