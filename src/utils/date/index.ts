import { isSameDay } from 'date-fns'

export function calculateConsecutiveDays(dates: Date[]): {
  latestConsecutive: { days: number; startDate: Date; endDate: Date }
  longestConsecutive: { days: number; startDate: Date; endDate: Date }
} {
  if (dates.length === 0) {
    return {
      latestConsecutive: {
        days: 0,
        startDate: new Date(),
        endDate: new Date(),
      },
      longestConsecutive: {
        days: 0,
        startDate: new Date(),
        endDate: new Date(),
      },
    }
  }

  // 按日期升序排序
  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime())

  // 计算最长持续打卡天数
  let longestConsecutive = {
    days: 1,
    startDate: sortedDates[0],
    endDate: sortedDates[0],
  }
  let currentConsecutive = {
    days: 1,
    startDate: sortedDates[0],
    endDate: sortedDates[0],
  }

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i]
    const previousDate = sortedDates[i - 1]

    // 判断是否连续打卡（前后日期差为 1 天）
    if (currentDate.getTime() - previousDate.getTime() === 86400000) {
      currentConsecutive.endDate = currentDate
      currentConsecutive.days++
    } else {
      // 更新最长持续打卡记录
      if (currentConsecutive.days > longestConsecutive.days) {
        longestConsecutive = { ...currentConsecutive }
      }
      // 重置
      currentConsecutive = {
        days: 1,
        startDate: currentDate,
        endDate: currentDate,
      }
    }
  }

  // 最后检查一次
  if (currentConsecutive.days > longestConsecutive.days) {
    longestConsecutive = { ...currentConsecutive }
  }

  // 计算最新的连续打卡天数（从最新的日期开始）
  let latestConsecutive = {
    days: 1,
    startDate: sortedDates[sortedDates.length - 1],
    endDate: sortedDates[sortedDates.length - 1],
  }
  for (let i = sortedDates.length - 1; i > 0; i--) {
    const currentDate = sortedDates[i]
    const previousDate = sortedDates[i - 1]

    // 判断是否连续打卡（前后日期差为 1 天）
    if (currentDate.getTime() - previousDate.getTime() === 86400000) {
      latestConsecutive.startDate = previousDate
      latestConsecutive.days++
    } else {
      break
    }
  }

  return {
    latestConsecutive,
    longestConsecutive,
  }
}

export function getSetDateArrayAndSort(array: Date[], deleteDate?: Date) {
  const arr = deleteDate
    ? array.filter((date) => !isSameDay(date, deleteDate))
    : array

  return Array.from(new Set(arr.sort((a, b) => a.getTime() - b.getTime())))
}
