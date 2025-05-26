import { ICoords } from "@/@types/ICoords";
import {
  addDevicesInArea,
  AreaSelector,
  orderCoordinates,
  SetViewOnClick,
} from "@/lib/utils";
import { useSimulationStore } from "@/stores/simulationStore";
import L from "leaflet";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet/dist/leaflet.css";
import {
  Expand,
  Radio,
  RadioTower,
  SaveAll,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useTranslation } from "react-i18next";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import "./style.css";

const svgString = encodeURIComponent(
  renderToStaticMarkup(<Radio size={32} color="black" />)
);
const iconUrl = `data:image/svg+xml,${svgString}`;

const svgGatewayString = encodeURIComponent(
  renderToStaticMarkup(<RadioTower size={32} color="red" />)
);

const iconGatewayUrl = `data:image/svg+xml,${svgGatewayString}`;

interface IMapLayoutProps {
  setFullScreen: (fullScreen: boolean) => void;
  fullScreen?: boolean;
  onSave?: (devices: ICoords[]) => void;
  onDelete?: () => void;
  gateways?: ICoords[];
}
export const MapLayout = ({
  setFullScreen,
  fullScreen = false,
  onSave,
  onDelete,
  gateways,
}: IMapLayoutProps) => {
  const { t } = useTranslation(); // Hook para traduzir strings
  const [, setCurrentPosition] = useState<[number, number]>();
  const [center, setCenter] = useState<ICoords>({
    lat: -5.0589993793432955,
    lng: -42.80016879851992,
  });
  const [locationInput, setLocationInput] = useState("");
  const [devices, setDevices] = useState<ICoords[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  const [area, setArea] = useState<ICoords[]>([]);
  const [devicesCount, setDevicesCount] = useState("0");

  const { setDevices: setDevicesStore } = useSimulationStore();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location", error);
        }
      );
    }
  }, []);

  const handleSearch = async () => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${locationInput}`
    );
    const data = await response.json();
    if (data[0]) {
      const newCenter = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
      setCenter(newCenter);
      alert(`${t("locationFound")} ${newCenter.lat}, ${newCenter.lng}`);
    } else {
      alert(t("locationNotFound"));
    }
  };

  const MapEffect = () => {
    const map = useMap();

    useEffect(() => {
      if (fullScreen) {
        map.invalidateSize();
      }
    }, [map]);

    return null;
  };

  return (
    <>
      <div className="flex space-x-2 mb-2">
        <Input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder={t("searchLocations")}
        />
        <Button
          className="px-4 py-2 bg-cyan-800 text-white font-semibold rounded hover:bg-cyan-700"
          onClick={handleSearch}
        >
          <Search size={18} />
        </Button>
        <Button
          className="px-4 py-2 bg-cyan-800 text-white font-semibold rounded hover:bg-cyan-700"
          onClick={() => setSelectMode(!selectMode)}
        >
          {selectMode ? t("stopSelecting") : t("selectArea")}
        </Button>
        <Input
          type="number"
          className="flex-1 p-2 border border-gray-300 rounded"
          value={devicesCount}
          onChange={(e) => setDevicesCount(e.target.value)}
          placeholder={t("numberOfDevices")}
        />
        <Button
          className="px-4 py-2 bg-cyan-800 text-white font-semibold rounded hover:bg-cyan-700"
          onClick={() =>
            addDevicesInArea(area, setDevices, Number(devicesCount))
          }
        >
          {t("addDevices")}
        </Button>
        <Button
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-900"
          onClick={() => {
            toast.success("success", {
              description: (
                <div className="">
                  <p>{t("devicesSavedMessage")}</p>
                  <p>{t("devicesSavedCount", { count: devices.length })}</p>
                </div>
              ),
            });
            if (onSave) {
              onSave(devices);
            }
          }}
        >
          <SaveAll size={18} />
        </Button>
        <Button
          className="px-4 py-2 bg-cyan-800 text-white font-semibold rounded hover:bg-cyan-700"
          onClick={() => setFullScreen(!fullScreen)}
        >
          <Expand size={18} />
        </Button>
      </div>

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "75vh", width: "100vh" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SetViewOnClick coords={center} />
        <AreaSelector active={selectMode} setArea={setArea} />
        {devices.map((point, index) => (
          <Marker
            key={index}
            position={point}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const newDevices: ICoords[] = [...devices];
                newDevices[index] = e.target.getLatLng();
                setDevices(newDevices);
                setDevicesStore(newDevices);
              },
            }}
            icon={
              new L.Icon({
                iconUrl: iconUrl,
                iconSize: [22, 22],
                className: "text-red-800",
              })
            }
          >
            <Popup>
              {t("device")} {index + 1}
            </Popup>
          </Marker>
        ))}
        {gateways?.map((point, index) => (
          <Marker
            key={index}
            position={point}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const newDevices: ICoords[] = [...devices];
                newDevices[index] = e.target.getLatLng();
                setDevices(newDevices);
                setDevicesStore(newDevices);
              },
            }}
            icon={
              new L.Icon({
                iconUrl: iconGatewayUrl,
                iconSize: [30, 30],
                className: "text-red-800",
              })
            }
          >
            <Popup>
              {t("gateway")} {index + 1}
            </Popup>
          </Marker>
        ))}
        {area.map((point, index) => (
          <Marker
            key={index}
            position={point}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const newArea: ICoords[] = [...area];
                newArea[index] = e.target.getLatLng();
                setArea(newArea);
              },
            }}
          >
            <Popup>
              {t("areaPoint")} {index + 1}
            </Popup>
          </Marker>
        ))}
        {area.length > 2 && (
          <Polygon positions={orderCoordinates({ points: area })} />
        )}
        {fullScreen && <MapEffect />}
      </MapContainer>

      <div className="flex space-x-2 mt-2">
        <Button
          className="px-4 py-2 bg-red-800 text-white font-semibold rounded hover:bg-red-900"
          onClick={() => {
            setDevices([]);
            setDevicesStore([]);
            if (onDelete) {
              onDelete();
            }
          }}
        >
          <Trash2 size={18} className="mr-2" />
          {t("deleteDevices")}
        </Button>
        <Button
          className="px-4 py-2 bg-red-800 text-white font-semibold rounded hover:bg-red-900 flex items-center"
          onClick={() => setArea([])}
        >
          <Trash2 size={18} className="mr-2" />
          {t("deleteArea")}
        </Button>
      </div>
    </>
  );
};
