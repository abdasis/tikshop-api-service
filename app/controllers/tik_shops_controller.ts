import { HttpContext } from '@adonisjs/core/http'
import puppeteer, { executablePath, PuppeteerLifeCycleEvent } from 'puppeteer'

type BrowserOptionProps = {
  executablePath: string
  headless: boolean
  args: string[]
  waitUntil: PuppeteerLifeCycleEvent | PuppeteerLifeCycleEvent[] | undefined
}

export default class TikShopsController {
  async scrapper({ request, response }: HttpContext) {
    console.log(request.input('url'))
    const browserOptions: BrowserOptionProps = {
      waitUntil: 'networkidle0',
      executablePath: executablePath('chrome'),
      headless: true,
      args: [
        '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"',
        '--no-sandbox',
        '--mute-audio',
      ],
    }

    const browser = await puppeteer.launch(browserOptions)
    const page = await browser.newPage()
    let url = request.input('url')
    await page.goto(url, browserOptions)

    await page.waitForSelector('.slick-slider')
    const title: string = await page.evaluate(() => {
      const element: Element | null = document.querySelector('.index-title--AnTxK')
      return element?.textContent?.trim() || ''
    })
    // Mendapatkan semua link gambar dari elemen img di dalam container dengan class "slick-slider"
    const imgLinks = await page.evaluate(() => {
      const imgElements = document.querySelectorAll('.slick-slider img')
      return Array.from(imgElements).map((img) => img.getAttribute('src'))
    })
    await page.close()
    return response.json({
      data: {
        title,
        imgLinks,
      },
    })
  }
}
