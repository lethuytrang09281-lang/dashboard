export interface Lot {
  id: string
  title: string
  address: string
  district: string
  type: "apartment" | "office" | "commercial" | "land" | "mkd"
  areaM2: number
  startPrice: number
  currentPrice: number
  marketPricePerM2: number
  dealScore: number
  investmentScore: number
  fraudRisk: number
  stage: "inventory" | "auction" | "public_offer" | "repeat"
  managerName: string
  managerKarma: number
  velocity: number
  nlpFlags: string[]
  priceHistory: { period: string; price: number }[]
  createdAt: string
  category: "hot" | "good" | "hidden_gem" | "early_bird" | "pass"
}

export interface DashboardStats {
  hotDeals: number
  goodOpportunities: number
  hiddenGems: number
  earlyBird: number
  totalLots: number
  avgDiscount: number
  avgDealScore: number
  lotsProcessedToday: number
}

const districts = [
  "Hamovniki",
  "Arbat",
  "Presnensky",
  "Basmanny",
  "Tverskoy",
  "Zamoskvorechye",
  "Tagansky",
  "Meshchansky",
  "Krasnoselsky",
  "Dorogomilovo",
]

const lotTypes: Lot["type"][] = [
  "apartment",
  "office",
  "commercial",
  "land",
  "mkd",
]
const typeLabels: Record<Lot["type"], string> = {
  apartment: "Квартира",
  office: "Офис",
  commercial: "Коммерция",
  land: "Земля",
  mkd: "МКД",
}

const stages: Lot["stage"][] = [
  "inventory",
  "auction",
  "public_offer",
  "repeat",
]
const stageLabels: Record<Lot["stage"], string> = {
  inventory: "Инвентаризация",
  auction: "Аукцион",
  public_offer: "Публичное предложение",
  repeat: "Повторные торги",
}

const categoryLabels: Record<Lot["category"], string> = {
  hot: "Hot Deal",
  good: "Good",
  hidden_gem: "Hidden Gem",
  early_bird: "Early Bird",
  pass: "Pass",
}

const nlpFlagOptions = [
  "только наличные",
  "без просмотра",
  "срочная продажа",
  "обременение",
  "судебный спор",
]

function generatePriceHistory(startPrice: number): { period: string; price: number }[] {
  const steps = 6 + Math.floor(Math.random() * 4)
  const history: { period: string; price: number }[] = []
  let price = startPrice
  for (let i = 0; i < steps; i++) {
    history.push({
      period: `Период ${i + 1}`,
      price: Math.round(price),
    })
    price *= 0.85 + Math.random() * 0.05
  }
  return history
}

function generateLot(id: number): Lot {
  const type = lotTypes[Math.floor(Math.random() * lotTypes.length)]
  const district = districts[Math.floor(Math.random() * districts.length)]
  const area = 30 + Math.floor(Math.random() * 200)
  const marketPricePerM2 =
    150000 + Math.floor(Math.random() * 200000)
  const marketTotal = marketPricePerM2 * area
  const discount = 0.3 + Math.random() * 0.4
  const startPrice = Math.round(marketTotal * (1 - discount * 0.5))
  const currentPrice = Math.round(marketTotal * (1 - discount))
  const investmentScore = Math.round(30 + Math.random() * 70)
  const fraudRisk = Math.round(Math.random() * 40)
  const dealScore = Math.max(
    0,
    Math.round(investmentScore - fraudRisk * 0.6)
  )
  const managerKarma = Math.round(40 + Math.random() * 60)
  const velocity = Math.round(Math.random() * 70)
  const flags: string[] = []
  if (Math.random() > 0.7) {
    flags.push(
      nlpFlagOptions[Math.floor(Math.random() * nlpFlagOptions.length)]
    )
  }
  if (Math.random() > 0.85) {
    flags.push(
      nlpFlagOptions[Math.floor(Math.random() * nlpFlagOptions.length)]
    )
  }
  const stage = stages[Math.floor(Math.random() * stages.length)]

  let category: Lot["category"] = "pass"
  if (dealScore >= 70) category = "hot"
  else if (dealScore >= 50) category = "good"
  else if (dealScore >= 30 && investmentScore >= 60 && fraudRisk > 20)
    category = "hidden_gem"
  if (stage === "inventory") category = "early_bird"

  return {
    id: `LOT-${String(id).padStart(5, "0")}`,
    title: `${typeLabels[type]} ${area}м² — ${district}`,
    address: `г. Москва, р-н ${district}, ул. ${["Ленина", "Пушкина", "Гагарина", "Мира", "Тверская"][Math.floor(Math.random() * 5)]}, д. ${Math.floor(Math.random() * 100) + 1}`,
    district,
    type,
    areaM2: area,
    startPrice,
    currentPrice,
    marketPricePerM2,
    dealScore,
    investmentScore,
    fraudRisk,
    stage,
    managerName: [
      "Иванов А.В.",
      "Петрова Е.С.",
      "Сидоров К.М.",
      "Козлова О.Н.",
      "Новиков Д.А.",
    ][Math.floor(Math.random() * 5)],
    managerKarma,
    velocity,
    nlpFlags: flags,
    priceHistory: generatePriceHistory(startPrice),
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 30 * 86400000)
    ).toISOString(),
    category,
  }
}

export function generateLots(count: number = 50): Lot[] {
  return Array.from({ length: count }, (_, i) => generateLot(i + 1))
}

export function computeStats(lots: Lot[]): DashboardStats {
  const hotDeals = lots.filter((l) => l.category === "hot").length
  const goodOpportunities = lots.filter(
    (l) => l.category === "good"
  ).length
  const hiddenGems = lots.filter(
    (l) => l.category === "hidden_gem"
  ).length
  const earlyBird = lots.filter(
    (l) => l.category === "early_bird"
  ).length
  const totalLots = lots.length
  const avgDiscount =
    lots.reduce((acc, l) => {
      const marketTotal = l.marketPricePerM2 * l.areaM2
      return acc + ((marketTotal - l.currentPrice) / marketTotal) * 100
    }, 0) / lots.length
  const avgDealScore =
    lots.reduce((acc, l) => acc + l.dealScore, 0) / lots.length

  return {
    hotDeals,
    goodOpportunities,
    hiddenGems,
    earlyBird,
    totalLots,
    avgDiscount: Math.round(avgDiscount),
    avgDealScore: Math.round(avgDealScore),
    lotsProcessedToday: 12 + Math.floor(Math.random() * 30),
  }
}

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return String(n)
}

export { typeLabels, stageLabels, categoryLabels }
