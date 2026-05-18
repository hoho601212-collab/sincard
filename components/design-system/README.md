# 핀토스 디자인 시스템

Figma 디자인을 기반으로 한 핀토스 디자인 시스템 컴포넌트 라이브러리입니다.

## 컴포넌트 목록

1. **Button** - 다양한 크기와 스타일의 버튼 컴포넌트
2. **Icon** - 화살표, 체크, 플러스 등 기본 아이콘
3. **Sidebar** - 사이드바 네비게이션 메뉴
4. **DateInput** - 날짜 입력 필드
5. **TextInputSection** - 제목/부제목 입력 섹션
6. **Header** - 로고와 네비게이션이 있는 헤더
7. **HeroSection** - 히어로 배너 (CTA 섹션)
8. **SectionHeader** - 섹션 제목 + 더보기 링크
9. **ProductCard** - 상품 카드 컴포넌트

---

## Button

### 사용법

```tsx
import { Button } from '@/components/design-system';

// 기본 사용
<Button>Button</Button>

// 부제목과 함께
<Button showSubtitle subtitle="Sub">Button</Button>

// 다양한 크기
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// 다양한 Variant
<Button variant="filled">Filled</Button>
<Button variant="outlined">Outlined</Button>

// 다양한 Status
<Button status="primary">Primary</Button>
<Button status="secondary">Secondary</Button>
<Button disabled>Disabled</Button>

// 아이콘 숨기기
<Button showIcon={false}>No Icon</Button>

// 조합 예제
<Button
  size="large"
  variant="filled"
  status="primary"
  showSubtitle
  subtitle="Sub"
>
  Button
</Button>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 버튼 크기 |
| `variant` | `'filled' \| 'outlined'` | `'filled'` | 버튼 스타일 변형 |
| `status` | `'primary' \| 'secondary' \| 'disabled'` | `'primary'` | 버튼 상태 |
| `subtitle` | `string` | - | 상단에 표시될 부제목 |
| `showSubtitle` | `boolean` | `false` | 부제목 표시 여부 |
| `showIcon` | `boolean` | `true` | 우측 아이콘(chevron) 표시 여부 |
| `children` | `React.ReactNode` | - | 버튼 텍스트 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |
| `className` | `string` | - | 추가 CSS 클래스 |
| `onClick` | `() => void` | - | 클릭 이벤트 핸들러 |

### 디자인 토큰

#### Colors

**Primary**
- `primary/50`: `#E6F0FF`
- `primary/100`: `#DAE8FF`
- `primary/200`: `#B2CFFF`
- `primary/300`: `#0565FF`
- `primary/600`: `#044CBF`

**Secondary**
- `secondary/50`: `#E6F9FF`
- `secondary/100`: `#D9F6FF`
- `secondary/300`: `#03C3FF`
- `secondary/600`: `#0292BF`

**Grayscale**
- `grayscale/50`: `#FAFAFA`
- `grayscale/100`: `#F5F5F5`
- `grayscale/500`: `#9E9E9E`
- `grayscale/900`: `#212121`

#### Typography

- `body1_sb_18`: 18px, SemiBold, Line height: 1.3
- `body2_m_18`: 18px, Medium, Line height: 1.3
- `body3_sb_16`: 16px, SemiBold, Line height: 1.3
- `body4_m_16`: 16px, Medium, Line height: 1.3
- `head3_sb_24`: 24px, SemiBold, Line height: 1.3
- `sub1_m_24`: 24px, Medium, Line height: 1.3

### 상태별 스타일

#### Filled + Primary
- **Default**: 파란 배경 (`#0565FF`), 흰색 텍스트
- **Hover**: 연한 파란 배경 (`#DAE8FF`), 파란 텍스트 (`#0565FF`)
- **Disabled**: 회색 배경 (`#F5F5F5`), 회색 텍스트 (`#9E9E9E`)

#### Filled + Secondary
- **Default**: 하늘 배경 (`#03C3FF`), 흰색 텍스트
- **Hover**: 연한 하늘 배경 (`#D9F6FF`), 하늘 텍스트 (`#0292BF`)
- **Disabled**: 회색 배경 (`#F5F5F5`), 회색 텍스트 (`#9E9E9E`)

#### Outlined + Primary
- **Default**: 파란 테두리 (`#0565FF`), 파란 텍스트
- **Hover**: 연한 파란 배경 (`#DAE8FF`)
- **Disabled**: 회색 테두리 (`#E0E0E0`), 회색 텍스트 (`#9E9E9E`)

#### Outlined + Secondary
- **Default**: 하늘 테두리 (`#03C3FF`), 밝은 배경 (`#FAFAFA`), 하늘 텍스트
- **Hover**: 연한 하늘 배경 (`#E6F9FF`)
- **Disabled**: 회색 테두리 (`#E0E0E0`), 회색 텍스트 (`#9E9E9E`)

---

## HeroSection

히어로 섹션 / CTA 배너 컴포넌트

### 사용법

```tsx
import { HeroSection } from '@/components/design-system';

<HeroSection
  title={['안전하고 빠른 결제,', '클릭 한 번이면 충분합니다']}
  subtitle="구매 즉시 발급, 24시간 언제든 사용 가능"
  buttonText="즉시 구매하기"
  onButtonClick={() => console.log('구매하기 클릭')}
  imageSrc="/hero-image.png"
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string[]` | - | 메인 제목 (배열, 각 요소가 한 줄) |
| `subtitle` | `string` | - | 부제목 |
| `buttonText` | `string` | `"즉시 구매하기"` | 버튼 텍스트 |
| `onButtonClick` | `() => void` | - | 버튼 클릭 핸들러 |
| `imageSrc` | `string` | `"/hero-image.png"` | 히어로 이미지 경로 |
| `imageAlt` | `string` | - | 이미지 alt 텍스트 |

---

## SectionHeader

섹션 제목 + 더보기 링크 컴포넌트

### 사용법

```tsx
import { SectionHeader } from '@/components/design-system';

// Small 사이즈 (더보기 링크 있음)
<SectionHeader
  title="추천 상품"
  showMoreLink
  moreHref="/products"
  onMoreClick={() => console.log('더보기 클릭')}
/>

// Medium 사이즈 (더보기 링크 없음)
<SectionHeader
  title="전체 상품 목록"
  size="medium"
  showMoreLink={false}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"제목을 입력해주세요"` | 섹션 제목 |
| `showMoreLink` | `boolean` | `true` | 더보기 링크 표시 여부 |
| `moreHref` | `string` | `"#"` | 더보기 링크 URL |
| `moreText` | `string` | `"더보기"` | 더보기 텍스트 |
| `size` | `'small' \| 'medium'` | `'small'` | 사이즈 |
| `onMoreClick` | `() => void` | - | 더보기 클릭 핸들러 |

---

## ProductCard

상품 카드 컴포넌트

### 사용법

```tsx
import { ProductCard } from '@/components/design-system';
import { useState } from 'react';

const [selectedId, setSelectedId] = useState(null);

<ProductCard
  brandLogo="/brand-logo.png"
  productName="컬쳐랜드"
  price="10,000원"
  buttonText="구매하기"
  selected={selectedId === 1}
  onClick={() => setSelectedId(1)}
  onPurchaseClick={() => console.log('구매')}
/>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `brandLogo` | `string` | - | 브랜드 로고 이미지 경로 |
| `brandLogoAlt` | `string` | `"브랜드 로고"` | 로고 alt 텍스트 |
| `productName` | `string` | `"상품명"` | 상품명 |
| `price` | `string` | `"00,000원"` | 가격 |
| `buttonText` | `string` | `"구매하기"` | 버튼 텍스트 |
| `selected` | `boolean` | `false` | 선택된 상태 (호버 스타일) |
| `showButton` | `boolean` | `true` | 버튼 표시 여부 |
| `onClick` | `() => void` | - | 카드 클릭 핸들러 |
| `onPurchaseClick` | `() => void` | - | 구매 버튼 클릭 핸들러 |

### 상태별 스타일

- **Default**: 회색 테두리 (`#E0E0E0`)
- **Selected**: 파란 테두리 (`#0565FF`), 파란 배경 버튼 (`#DAE8FF`)
- **Hover**: 파란 테두리로 변경
